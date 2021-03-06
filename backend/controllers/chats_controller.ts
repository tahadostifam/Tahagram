import { profile_photos_directory } from "./profile_photos_controller";
import { Request, Response, NextFunction } from "express";
import status_codes from "../lib/status_codes";
import crypto from "crypto";
import fs from "fs";

import User from "../models/user";
import Chats from "../models/chats";
import slugify from "slugify";
import { IMiddleWareRequest } from "../lib/interfaces";

export interface IRequest extends Request, IMiddleWareRequest {
    username: string;
    files: any;
}

export default {
    CreateChannelAction: async (req: IRequest, res: Response, next: NextFunction) => {
        const user = await User.findOne({
            username: req.username,
        });

        if (!user) return status_codes.invalid_token(req, res, next);

        req.body.channel_username = slugify(req.body.channel_username, {
            lower: true,
            strict: false,
            locale: "vi",
        });

        checkUsernameUniqueness(req.body.channel_username).then(
            async () => {
                // username is unique | ok
                var final_profile_photo_filename;
                if (req.files && req.files["profile_photo"]) {
                    // user wanna create a channel with profile_photo
                    const photo = req.files["profile_photo"];
                    async function generateRandomFileName() {
                        final_profile_photo_filename = await crypto.randomBytes(15).toString("hex");
                        if (fs.existsSync(profile_photos_directory + final_profile_photo_filename)) {
                            console.log("bad filename :)");

                            await generateRandomFileName();
                        }
                    }

                    await generateRandomFileName();

                    try {
                        await photo.mv(process.cwd() + "/uploads/profile_photos/" + final_profile_photo_filename);
                    } catch {
                        final_profile_photo_filename = undefined;
                        return status_codes.error(req, res, next);
                    }
                }

                let channel_data: any = {
                    chat_type: "channel",
                    username: req.body.channel_username,
                    full_name: req.body.channel_name,
                    creator_username: req.username,
                    members: [],
                };
                if (final_profile_photo_filename) {
                    channel_data["profile_photos"] = {
                        filename: final_profile_photo_filename,
                    };
                }
                if (req.body.bio && req.body.bio.length > 0) {
                    channel_data["bio"] = req.body.bio;
                }

                const channel = new Chats(channel_data);

                await channel.save();

                await User.updateOne(
                    {
                        username: req.username,
                    },
                    {
                        $push: {
                            chats: {
                                chat_id: channel._id,
                            },
                        },
                    }
                );

                let data_to_send: any = {
                    chat_id: channel._id,
                };
                if (final_profile_photo_filename) {
                    data_to_send["profile_photo"] = final_profile_photo_filename;
                }
                status_codes.channel_created(data_to_send, req, res, next);
            },
            () => {
                status_codes.username_is_not_unique(req, res, next);
            }
        );
    },
    CreateGroupAction: async (req: IRequest, res: Response, next: NextFunction) => {
        const user = await User.findOne({
            username: req.username,
        });

        if (!user) return status_codes.invalid_token(req, res, next);

        checkUsernameUniqueness(req.body.group_username).then(
            async () => {
                // username is unique | ok
                const creator_info: any = {
                    full_name: user.full_name,
                    username: user.username,
                    position: "creator",
                    last_seen: user.last_seen,
                };
                if (user.profile_photos && user.profile_photos.length > 0) {
                    creator_info.profile_photos = [user.profile_photos[user.profile_photos.length - 1]];
                }
                const group = new Chats({
                    chat_type: "group",
                    username: req.body.group_username,
                    full_name: req.body.group_name,
                    creator_username: req.username,
                    members: [],
                });

                await group.save();

                await User.updateOne(
                    {
                        username: req.username,
                    },
                    {
                        $push: {
                            chats: {
                                chat_id: group._id,
                            },
                        },
                    }
                );

                status_codes.group_created(
                    {
                        members: [creator_info],
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
