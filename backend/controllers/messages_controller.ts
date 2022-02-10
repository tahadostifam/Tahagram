import { Request, Response, NextFunction } from "express";
import status_codes from "../lib/status_codes";
import crypto from "crypto";
import fs from "fs";
import { justImageFile } from "./profile_photos_controller";
import { users } from "../socket/socket";

import User from "../models/user";
import Chats from "../models/chats";
import { ObjectId } from "mongodb";
import { IChat, IImageMessage, ISocketClient, ITextMessage, IUser } from "../lib/interfaces";
import { createPrivateRoom, rooms } from "../socket/room_manager";
import { pushChatToUserChatsList } from "../socket/events/chats";

export const photo_messages_directory = "/uploads/photo_messages/";

export interface IRequest extends Request {
    files: any;
}

export default {
    NewPhotoMessageAction: async (req: IRequest, res: Response, next: NextFunction) => {
        const chat_id = req.body.chat_id;
        const chat_type = req.body.chat_type;
        const target_username = req.body.target_username;
        const caption = req.body.caption;

        if (!req.files || !req.files["photo"]) {
            res.statusCode = 400;
            return res.send({
                errors: [
                    {
                        msg: "Photo can't be empty",
                        param: "photo",
                        location: "body",
                    },
                ],
            });
        }

        const photo = req.files["photo"];
        if (justImageFile(photo)) {
            const user: IUser = await User.findOne({
                username: req.headers.username,
            });

            if (!user) return status_codes.invalid_token(req, res, next);

            var final_filename: string = "";
            async function generateRandomFileName() {
                final_filename = await crypto.randomBytes(10).toString("hex");
                if (fs.existsSync(photo_messages_directory + final_filename)) {
                    console.log("bad filename :)");

                    await generateRandomFileName();
                }
            }

            await generateRandomFileName();

            try {
                if (final_filename && final_filename.trim().length != 0) {
                    const message: IImageMessage = {
                        message_id: new ObjectId().toString(),
                        sender_username: user.username,
                        message_type: "photo",
                        send_time: Date.now(),
                        edited: false,
                        seen_state: "sended",
                        filename: final_filename,
                    };
                    async function pushMessage(message: any, response: object) {
                        await photo.mv(process.cwd() + photo_messages_directory + String(final_filename));
                        await Chats.findOneAndUpdate(
                            { _id: chat_id },
                            {
                                $push: {
                                    messages_list: message,
                                },
                            }
                        );

                        user_ws?.ws.send(JSON.stringify(response));
                    }

                    const user_ws = users.find(({ username: _username_ }) => user.username);
                    if (user_ws) {
                        user_ws.ws.send(
                            JSON.stringify({
                                event: "send_text_message",
                                chat_id: chat_id,
                                message: "message sended",
                                message_callback: message,
                            })
                        );
                    }

                    async function handle_socket() {
                        if (chat_type == "private") {
                            const chat = await Chats.findOne({
                                chat_id: chat_id,
                            });
                            if (chat) {
                                if (target_username && target_username.length > 0 && target_username != user.username) {
                                    var target_ws: ISocketClient | undefined;
                                    let chat: IChat = await Chats.findOne({
                                        $or: [{ sides: { user_1: user.username, user_2: target_username } }, { sides: { user_1: target_username, user_2: user.username } }],
                                    });

                                    function setTargetWs() {
                                        target_ws = users.find(({ username: _username_ }) => _username_ === target_username);
                                    }

                                    if (chat) {
                                        await setTargetWs();

                                        if (!target_ws || String(target_ws).trim() == "") {
                                            target_ws = undefined;
                                            console.log("E :: target_ws not found");
                                        }
                                    }

                                    if (chat) {
                                        const room = rooms[chat_id];
                                        if (room) {
                                            if (target_ws) {
                                                broadCastToOtherSide(target_ws, chat.chat_type, false);
                                            } else {
                                                console.error("B :: cannot find target_ws");
                                            }
                                        } else {
                                            if (chat._id && target_username) {
                                                createPrivateRoom(chat._id, user.username, target_username).then((room) => {
                                                    if (target_ws) {
                                                        broadCastToOtherSide(target_ws, chat.chat_type, true);
                                                    } else {
                                                        console.error("C :: cannot find target_ws");
                                                    }
                                                });
                                            } else {
                                                console.error("chat._id or target_username or target_ws is empty");
                                            }
                                        }
                                        pushMessage(message, {
                                            event: "send_text_message",
                                            chat_id: chat_id,
                                            message: "message sended",
                                            message_callback: message,
                                        });
                                    } else {
                                        await setTargetWs();

                                        // we must create a new private_chat
                                        const user = await User.findOne({
                                            username: target_username,
                                        });
                                        if (user) {
                                            var new_chat = new Chats({
                                                chat_type: "private",
                                                messages_list: message,
                                                sides: {
                                                    user_1: user.username,
                                                    user_2: target_username,
                                                },
                                            });
                                            await new_chat.save();
                                            // Add this chat into user_1 and user_2 chats_list

                                            pushChatToUserChatsList(user.username, new_chat._id);
                                            pushChatToUserChatsList(target_username, new_chat._id);

                                            // to the sender
                                            pushMessage(message, {
                                                chat_created: {
                                                    chat_id: new_chat._id,
                                                    sides: {
                                                        user_1: user.username,
                                                        user_2: target_username,
                                                    },
                                                },
                                                event: "send_text_message",
                                                chat_id: new_chat._id,
                                                message: "message sended",
                                                message_callback: message,
                                                chat_type: "private",
                                                target_username: target_username,
                                            });

                                            // to the receiver
                                            createPrivateRoom(new_chat._id, user.username, target_username).then(() => {
                                                if (target_ws) {
                                                    let data_to_send: any = {
                                                        __chat_created: {
                                                            chat_id: new_chat._id,
                                                            sides: {
                                                                user_1: user.username,
                                                                user_2: target_username,
                                                            },
                                                            messages: [message],
                                                            full_name: user.full_name,
                                                            username: user.username,
                                                        },
                                                        event: "chat_created_from_a_user",
                                                        chat_id: new_chat._id,
                                                        chat_type: "private",
                                                    };
                                                    if (user.profile_photos.length > 0) {
                                                        data_to_send["profile_photo"] = user.profile_photos[0];
                                                    }
                                                    target_ws.ws.send(JSON.stringify(data_to_send));
                                                } else {
                                                    console.log("D :: target_ws not found");
                                                }
                                            });
                                        }
                                    }

                                    async function broadCastToOtherSide(target_ws: ISocketClient | undefined, chat_type: string, chat_created: boolean) {
                                        if (target_ws) {
                                            const new_chat: any = {
                                                username: target_ws.ws.user.username,
                                                full_name: target_ws.ws.user.full_name,
                                                sides: {
                                                    user_1: user.username,
                                                    user_2: target_ws.ws.user.username,
                                                },
                                                target_username: target_username,
                                            };
                                            if (user.profile_photos.length > 0) {
                                                new_chat["profile_photo"] = user.profile_photos[0];
                                            }
                                            let data_to_send: any = {
                                                event: "you_have_new_message",
                                                message: message,
                                                chat_id: chat_id,
                                            };
                                            if (chat_created) {
                                                // our method cannot know that when should will send the `new_chat`
                                                data_to_send["chat_type"] = chat_type;
                                                data_to_send["new_chat"] = new_chat;
                                            }
                                            target_ws.ws.send(JSON.stringify(data_to_send));
                                        } else {
                                            console.log("E :: target_ws not found");
                                        }
                                    }
                                } else {
                                    console.log("target_username not found");
                                }
                            } else {
                                console.log("chat not found");
                            }
                        }
                    }

                    handle_socket();
                } else {
                    console.log("final_filename is empty!");
                }
            } catch {
                status_codes.error(req, res, next);
            }
        } else {
            status_codes.file_not_valid(req, res, next);
        }
    },
};
