import express, { NextFunction, Request, Response } from "express";
import { cleanIpDots, clientIp } from "../lib/client_ip";
import * as database from "../lib/database";
import status_codes from "../lib/status_codes";
import store, { makeUserStoreId } from "../lib/store";
import { IMiddleWareRequest } from "../lib/interfaces";
import User from "../models/user";

export default function (req: any, res: Response, next: NextFunction) {
    const client_ip = clientIp(req, res)?.toString();
    if (client_ip) {
        // FIXME - fixing -> nginx forwarding_headers on reverse_proxy
        if (req.body.username) {
            req.headers.username = req.body.username;
        }
        if (req.body.auth_token) {
            req.headers.auth_token = req.body.auth_token;
        }

        if (req.headers.username && req.headers.auth_token) {
            const username: string = String(req.headers.username);
            const auth_token: string = String(req.headers.auth_token);
            if (username && auth_token) {
                const user_id_in_store = makeUserStoreId(username, "auth", cleanIpDots(client_ip));
                store.get(user_id_in_store).then(async (token_in_store) => {
                    if (String(token_in_store).trim() == String(auth_token).trim()) {
                        // success | requested token is valid
                        const user = await User.findOne({
                            username: req.headers.username,
                        });
                        if (!user) return status_codes.invalid_token(req, res, next);
                        req.username = username;
                        req.user_info = user;
                        next();
                    } else {
                        status_codes.invalid_token(req, res, next);
                    }
                });
            }
        } else {
            res.statusCode = 400;
            return res.send({
                message: "username or auth_token not found in request header",
            });
        }
    }
}
