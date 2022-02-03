import { Request, Response, NextFunction } from "express";
import status_codes from "../lib/status_codes";
import crypto from "crypto";
import fs from "fs";

import User from "../models/user";

export const photo_messages_directory = "/uploads/photo_messages/";

export interface IRequest extends Request {
    files: any;
}

export default {
    NewPhotoMessageAction: async (req: IRequest, res: Response, next: NextFunction) => {
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

        const user = await User.findOne({
            username: req.headers.username,
        });

        if (!user) return status_codes.invalid_token(req, res, next);

        const photo = req.files["photo"];

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
            await photo.mv(process.cwd() + photo_messages_directory + final_filename);
        } catch {
            status_codes.error(req, res, next);
        }
    },
};
