import { Request, Response, NextFunction } from "express";
import status_codes from "../lib/status_codes";
import crypto from "crypto";
import fs from "fs";
import { justImageFile } from "./profile_photos_controller";
import { users } from "../socket/socket";

import User from "../models/user";
import Chats from "../models/chats";
import { ObjectId } from "mongodb";
import { IChat, IPhotoMessage, ISocketClient, ITextMessage, IUser } from "../lib/interfaces";
import { createPrivateRoom, rooms } from "../socket/room_manager";
import { handle_messages_socket, pushChatToUserChatsList } from "../socket/events/chats";

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
                    const message: IPhotoMessage = {
                        message_id: new ObjectId().toString(),
                        sender_username: user.username,
                        message_type: "photo",
                        send_time: Date.now(),
                        edited: false,
                        seen_state: "sended",
                        filename: final_filename,
                    };
                    if (caption && caption.length > 0) {
                        message.caption = caption;
                    }

                    await photo.mv(process.cwd() + photo_messages_directory + String(final_filename));

                    const user_ws = await users.find(({ username: _username_ }) => user.username);

                    if (user_ws) {
                        handle_messages_socket(chat_id, chat_type, target_username, user_ws.ws, message);
                    } else {
                        console.log("user_ws not found on new_photo_message");
                    }
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
