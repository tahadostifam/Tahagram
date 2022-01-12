import { Request, Response, NextFunction } from "express";
import { clientIp, cleanIpDots } from "../lib/client_ip";
import * as database from "../lib/database";
import status_codes from "../lib/status_codes";
import store, { makeUserStoreId, setUserTokens } from "../lib/store";
import crypto from "crypto";

export default {
    UploadPictureAction: async (req: any, res: Response, next: NextFunction) => {
        console.log(req.body);
        console.log(req.files);

        if (!req.files || !req.files["picture"]) {
            res.statusCode = 400;
            return res.send({
                errors: [
                    {
                        msg: "Picture can't be empty",
                        param: "picture",
                        location: "body",
                    },
                ],
            });
        }
        const final_filename = await crypto.randomBytes(10).toString("hex");
        req.files.picture.mv(process.cwd() + "/uploads/profile_pictures/" + final_filename);
    },
};
