import express, { NextFunction, Request, Response } from "express";
import * as database from "../lib/database";
import status_codes from "../lib/status_codes";
import { IMiddleWareRequest } from "../lib/interfaces";
import User from "../models/user";
import { compareToken, removeBearerKeyword } from "../lib/jwt";

export default async function (req: any, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
        let token: string = String(req.headers.authorization);
        if (token) {
            token = removeBearerKeyword(token);
            // token is valid
            await compareToken(token).then(
                async (payload: any) => {
                    const user = await User.findOne({
                        username: payload.username,
                    });
                    if (!user) return status_codes.invalid_token(req, res, next);
                    req.username = payload.username;
                    next();
                },
                () => {
                    status_codes.invalid_token(req, res, next);
                }
            );
        }
    } else {
        res.statusCode = 400;
        return res.send({
            message: "Authorization not found in request header",
        });
    }
}
