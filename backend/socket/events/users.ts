import User from "../../models/user";
import Chats from "../../models/chats";
import { ObjectId } from "mongodb";
import { response } from "express";
import { createPrivateRoom, rooms } from "../room_manager";

import { IChat, IWebSocket } from "../../lib/interfaces";
import { users } from "../socket";

export async function update_full_name(ws: IWebSocket, parsedData: any) {
    if (parsedData.full_name && parsedData.full_name.trim() != "") {
        const update = await User.findOneAndUpdate(
            {
                username: ws.user.username,
            },
            {
                full_name: parsedData.full_name,
            }
        );
        if (update) {
            ws.send(
                JSON.stringify({
                    message: "full_name updated",
                    full_name: parsedData.full_name,
                })
            );
        }
    }
}

export async function update_bio(ws: IWebSocket, parsedData: any) {
    if (parsedData.bio && parsedData.bio.trim() != "") {
        const update = await User.findOneAndUpdate(
            {
                username: ws.user.username,
            },
            {
                bio: parsedData.bio,
            }
        );
        if (update) {
            ws.send(
                JSON.stringify({
                    message: "bio updated",
                    bio: parsedData.bio,
                })
            );
        }
    }
}

export async function send_text_message(ws: IWebSocket, parsedData: any) {
    const chat_id = parsedData.chat_id;
    const message_text = parsedData.send_text_message_input;

    if (message_text && message_text.trim() != "" && chat_id && chat_id.trim() != "") {
        const message_id = new ObjectId().toString();
        const message = {
            message_id: message_id,
            sender_username: ws.user.username,
            message_type: "text",
            send_time: Date.now(),
            content: message_text,
            edited: false,
        };

        async function pushMessage(response: object) {
            const result = await Chats.findOneAndUpdate(
                { _id: chat_id },
                {
                    $push: {
                        messages_list: message,
                    },
                }
            );

            ws.send(JSON.stringify(response));
        }

        async function broadCastToOtherSide() {
            console.log("imported", rooms);
        }

        let chat: IChat = await Chats.findById(chat_id);
        if (chat) {
            pushMessage({
                event: "send_text_message",
                chat_id: chat_id,
                message: "message sended",
                message_callback: message,
            });

            if (chat.chat_type == "private") {
                broadCastToOtherSide();
            } else {
                // TODO
                console.log("chat is not private :)");
            }
        } else {
            // we must create a new private_chat
            const target_username = parsedData.target_username;
            if (target_username && target_username.length > 0) {
                const user = await User.findOne({
                    username: target_username,
                });
                if (user) {
                    const chat = new Chats({
                        chat_type: "private",
                        messages_list: message,
                        sides: {
                            user_1: ws.user.username,
                            user_2: target_username,
                        },
                    });
                    await chat.save();
                    // Add this chat into user_1 and user_2 chats_list
                    async function pushChatToUserChatsList(username: String) {
                        let user = await User.findOne({
                            username: username,
                        });
                        user = JSON.parse(JSON.stringify(user));
                        if (user) {
                            const find_result = Array(user.chats).find(({ _id }) => _id == chat._id);
                            if (!find_result || find_result.length == 0) {
                                return await User.updateOne(
                                    {
                                        username: username,
                                    },
                                    {
                                        $push: {
                                            chats: {
                                                chat_id: chat._id, // the id of chat [chats collection]
                                            },
                                        },
                                    }
                                );
                            }
                            console.log("user alredy have this chat!!");
                        }
                    }

                    pushChatToUserChatsList(ws.user.username);
                    pushChatToUserChatsList(target_username);

                    pushMessage({
                        chat_created: {
                            chat_id: chat._id,
                            sides: {
                                user_1: ws.user.username,
                                user_2: target_username,
                            },
                        },
                        event: "send_text_message",
                        chat_id: chat_id,
                        message: "message sended",
                        message_callback: message,
                        chat_type: "private",
                        target_username: target_username,
                    });

                    // ANCHOR
                    const second_side_ws = users.find(({ username }) => target_username);
                    if (second_side_ws) {
                        createPrivateRoom(
                            chat._id,
                            {
                                username: ws.user.username,
                                ws: ws,
                            },
                            {
                                username: ws.user.username,
                                ws: second_side_ws.ws,
                            }
                        ).then((room) => {
                            broadCastToOtherSide();
                        });
                    }
                }
            }
        }
    }
}

export async function delete_message(ws: IWebSocket, parsedData: any) {
    const chat_id = parsedData.chat_id;
    const _message_id = parsedData.message_id;
    if (chat_id && chat_id.length > 0 && _message_id && _message_id.length > 0) {
        const chat = await Chats.findById(chat_id);
        if (chat) {
            const messages: Array<any> = chat.messages_list;
            const message_id_exists = messages.find(({ message_id }) => message_id === _message_id);

            if (message_id_exists) {
                await Chats.updateOne(
                    { _id: chat_id },
                    {
                        $pull: {
                            messages_list: {
                                message_id: _message_id,
                            },
                        },
                    }
                );
                ws.send(
                    JSON.stringify({
                        message: "message deleted",
                        chat_id: chat_id,
                        message_id: _message_id,
                    })
                );
            }
        }
    }
}
