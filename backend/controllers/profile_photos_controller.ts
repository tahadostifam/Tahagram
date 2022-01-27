import { Request, Response, NextFunction } from "express";
import { clientIp, cleanIpDots } from "../lib/client_ip";
import * as database from "../lib/database";
import status_codes from "../lib/status_codes";
import store, { makeUserStoreId, setUserTokens } from "../lib/store";
import crypto from "crypto";
import fs from "fs";

import User from "../models/user";

const profile_photos_directory = "/uploads/profile_photos/";

export interface IRequest extends Request {
    files: any;
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

        let final_filename;
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

        const user = await User.findOne({
            username: req.headers.username,
        });

        if (!user) return status_codes.invalid_token(req, res, next);

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
    },
};
