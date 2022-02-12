import { Request, Response, NextFunction } from "express";
import { clientIp, cleanIpDots } from "../lib/client_ip";
import * as database from "../lib/database";
import status_codes from "../lib/status_codes";
import store, { makeUserStoreId, setUserTokens } from "../lib/store";
import crypto from "crypto";
import fs from "fs";

import User from "../models/user";
import { IUser } from "../lib/interfaces";

export const profile_photos_directory = "/uploads/profile_photos/";

export interface IRequest extends Request {
    files: any;
}

export function justImageFile(file: any) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        return true;
    }
    return false;
}

export default {
    UploadPhotoAction: async (req: IRequest, res: Response, next: NextFunction) => {
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
            const user = await User.findOne({
                username: req.headers.username,
            });

            if (!user) return status_codes.invalid_token(req, res, next);

            let final_filename;
            async function generateRandomFileName() {
                final_filename = await crypto.randomBytes(15).toString("hex");
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

            await User.updateOne(
                {
                    username: req.headers.username,
                },
                {
                    $push: {
                        profile_photos: {
                            filename: final_filename,
                        },
                    },
                }
            );

            status_codes.profile_photo_uploaded(
                {
                    profile_photo_filename: final_filename,
                },
                req,
                res,
                next
            );
        } else {
            status_codes.file_not_valid(req, res, next);
        }
    },
    RemoveProfilePhotoAction: async (req: IRequest, res: Response, next: NextFunction) => {
        const filename = req.body.filename;
        const user: IUser = await User.findOne({
            username: req.headers.username,
        });
        if (user) {
            const is_users_profile = user.profile_photos.find(({ filename: _filename_ }) => _filename_ == filename);
            if (is_users_profile) {
                await User.updateOne(
                    {
                        username: req.headers.username,
                    },
                    {
                        $pull: {
                            profile_photos: {
                                filename: filename,
                            },
                        },
                    }
                );

                status_codes.profile_photo_removed(req, res, next);
                if (await fs.existsSync(process.cwd() + profile_photos_directory + filename)) {
                    await fs.unlinkSync(process.cwd() + profile_photos_directory + filename);
                } else {
                    console.log("profile_photo deos not exists in /profile_photos_directory/");
                }
            } else {
                status_codes.cannot_remove_profile_photo(req, res, next);
            }
        } else {
            return status_codes.invalid_token(req, res, next);
        }
    },
};
