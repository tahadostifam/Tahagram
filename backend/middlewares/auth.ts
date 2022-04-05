import express, { NextFunction, Request, Response } from "express";
import * as database from "../lib/database";
import status_codes from "../lib/status_codes";
import { IMiddleWareRequest, IUser } from "../lib/interfaces";
import User from "../models/user";

export default async function (req: any, res: Response, next: NextFunction, dosomething?: (user: IUser) => void) {
    const user = req.session.user;
    if (user) {
        next();
        if (dosomething) {
            dosomething(user);
        }
    } else {
        status_codes.invalid_token(req, res, next);
    }
}
