import { Request, Response, NextFunction } from "express";
import status_codes from "../lib/status_codes";
import crypto from "crypto";
import fs from "fs";
import { justImageFile } from "./profile_photos_controller";
import { users } from "../socket/socket";

import User from "../models/user";
import Chats from "../models/chats";
import { ObjectId } from "mongodb";
import { IImageMessage, ITextMessage, IUser } from "../lib/interfaces";

export const photo_messages_directory = "/uploads/photo_messages/";

export interface IRequest extends Request {
    files: any;
}

export default {
    NewPhotoMessageAction: async (req: IRequest, res: Response, next: NextFunction) => {
        const chat_id = req.body.chat_id;
        const caption = req.body.caption;

        const chat = await Chats.findOne({
            chat_id: chat_id,
        });
        if (chat) {
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

                let final_filename;
                async function generateRandomFileName() {
                    final_filename = await crypto.randomBytes(10).toString("hex");
                    if (fs.existsSync(photo_messages_directory + final_filename)) {
                        console.log("bad filename :)");

                        await generateRandomFileName();
                    }
                }

                await generateRandomFileName();

                try {
                    if (final_filename) {
                        await photo.mv(process.cwd() + photo_messages_directory + final_filename);
                        const message: IImageMessage = {
                            message_id: new ObjectId().toString(),
                            sender_username: user.username,
                            message_type: "photo",
                            send_time: Date.now(),
                            edited: false,
                            seen_state: "sended",
                            filename: final_filename,
                        };
                        await Chats.findOneAndUpdate(
                            { _id: chat_id },
                            {
                                $push: {
                                    messages_list: message,
                                },
                            }
                        );

                        const user_ws = users.find(({ username: _username_ }) => req.headers.username);
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
                    } else {
                        console.log("final_filename is empty!");
                    }
                } catch {
                    status_codes.error(req, res, next);
                }
            } else {
                status_codes.file_not_valid(req, res, next);
            }
        } else {
            res.statusCode = 400;
            res.send({
                message: "chat not found",
            });
        }
    },
};
