import { Request, Response, NextFunction } from "express";
import { clientIp, cleanIpDots } from "../lib/client_ip";
import * as database from "../lib/database";
import status_codes from "../lib/status_codes";
import store, { makeUserStoreId, setUserTokens } from "../lib/store";
import crypto from "crypto";

export default {
    UploadPhotoAction: async (req: any, res: Response, next: NextFunction) => {
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

        const final_filename = await crypto.randomBytes(10).toString("hex");
        try {
            await photo.mv(process.cwd() + "/uploads/profile_photos/" + final_filename + ".tmp");
        } catch {
            status_codes.error(req, res, next);
        }

        // TODO
    },
};
