import { NextFunction } from "express";
import * as database from "../lib/database";
import User from "../models/user";
import { compareToken, removeBearerKeyword } from "../lib/jwt";
import status_codes from "../lib/status_codes";

export default async function (ws: any, req: any, next: NextFunction) {
    let token = req.query.Authorization;
    if (token) {
        token = removeBearerKeyword(token);
        // token is valid
        await compareToken(token).then(
            async (payload: any) => {
                const user = await User.findOne({
                    username: payload.username,
                });
                if (!user) return status_codes.socket_invalid_token(ws);
                req.username = payload.username;
                next();
            },
            () => {
                status_codes.socket_invalid_token(ws);
            }
        );
    } else {
        status_codes.socket_invalid_token(ws);
    }
}
