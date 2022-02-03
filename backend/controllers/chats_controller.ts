import { profile_photos_directory } from "./profile_photos_controller";
import { Request, Response, NextFunction } from "express";
import status_codes from "../lib/status_codes";
import crypto from "crypto";
import fs from "fs";

import User from "../models/user";
import Chats from "../models/chats";

export interface IRequest extends Request {
    files: any;
}

export default {
    CreateChannelAction: async (req: IRequest, res: Response, next: NextFunction) => {
        const user = await User.findOne({
            username: req.headers.username,
        });

        if (!user) return status_codes.invalid_token(req, res, next);

        checkUsernameUniqueness(req.body.channel_username).then(
            async () => {
                // username is unique | ok
                if (req.files && !req.files["photo"]) {
                    // user wanna create a channel with profile_photo
                    const photo = req.files["photo"];
                    var final_filename;
                    async function generateRandomFileName() {
                        final_filename = await crypto.randomBytes(10).toString("hex");
                        if (fs.existsSync(profile_photos_directory + final_filename)) {
                            console.log("bad filename :)");

                            await generateRandomFileName();
                        }
                    }

                    await generateRandomFileName();

                    try {
                        await photo.mv(process.cwd() + profile_photos_directory + final_filename);
                    } catch {
                        status_codes.error(req, res, next);
                    }
                }

                let channel_data: any = {
                    chat_type: "channel",
                    username: req.body.channel_username,
                    full_name: req.body.channel_name,
                    creator_username: req.headers.username,
                };
                if (final_filename) {
                    channel_data["profile_photo"] = final_filename;
                }
                if (req.body.bio && req.body.bio.length > 0) {
                    channel_data["bio"] = req.body.bio;
                }
                const channel = new Chats(channel_data);

                await channel.save();

                await User.updateOne(
                    {
                        username: req.headers.username,
                    },
                    {
                        $push: {
                            chats: {
                                chat_id: channel._id,
                            },
                        },
                    }
                );

                status_codes.channel_created(
                    {
                        profile_photo: final_filename,
                    },
                    req,
                    res,
                    next
                );
            },
            () => {
                status_codes.username_is_not_unique(req, res, next);
            }
        );
    },
};

export async function checkUsernameUniqueness(username: string) {
    return new Promise(async (is_unique: any, is_not_unique: any) => {
        const channel = await Chats.findOne({
            username: username,
        });
        if (channel) {
            return is_not_unique();
        }
        is_unique();
    });
}
