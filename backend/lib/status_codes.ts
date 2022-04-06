import { Request, Response, NextFunction } from "express";
import { WebSocket } from "ws";

export default {
    verific_email_sent(req: Request, res: Response, next: NextFunction) {
        res.send({
            message: "verific email sent",
        });
    },
    bad_verific_code(req: Request, res: Response, next: NextFunction) {
        res.send({
            message: "verific code is not valid"
        })
    },
    verific_code_expired(req: Request, res: Response, next: NextFunction) {
        res.send({
            message: "verific code expired"
        })
    },
    verific_code_limit(req: Request, res: Response, next: NextFunction){
        res.statusCode = 503
        res.send({
            message: "verific_code_limit",
            full_message: "The limits are full, please try again in 3 hours"
        })
    },
    username_is_not_unique(req: Request, res: Response, next: NextFunction) {
        res.statusCode = 409
        res.send({
            message: "username is not unique",
        });
    },
    success_signin(data: any, req: Request, res: Response, next: NextFunction) {
        res.send({
            message: "success",
            data: data.user,
        });
    },
    error(req: Request, res: Response, next: NextFunction) {
        res.statusCode = 500;
        res.send({
            message: "an error occurred on the server side",
        });
    },
    email_already_registered(req: Request, res: Response, next: NextFunction) {
        res.statusCode = 409;
        res.send({
            message: "email already registered",
        });
    },
    invalid_token(req: Request, res: Response, next: NextFunction) {
        res.statusCode = 401;
        res.send({
            message: "Invalid token",
        });
    },
    socket_invalid_token(ws: WebSocket) {
        ws.send(
            JSON.stringify({
                code: 401,
                type: "error",
                message: "Invalid token",
            })
        );
    },
    profile_photo_uploaded(data: any, req: Request, res: Response, next: NextFunction) {
        res.statusCode = 200;
        res.send({
            message: "profile photo uploaded",
            profile_photo_filename: data.profile_photo_filename,
        });
    },
    channel_created(data: any, req: Request, res: Response, next: NextFunction) {
        res.statusCode = 201;
        res.send(
            Object.assign(data, {
                message: "channel created",
            })
        );
    },
    group_created(data: any, req: Request, res: Response, next: NextFunction) {
        res.statusCode = 201;
        res.send(
            Object.assign(data, {
                message: "group created",
            })
        );
    },
    email_is_not_unique(req: Request, res: Response, next: NextFunction) {
        res.statusCode = 409;
        res.send({
            message: "another chat exists with this email",
        });
    },
    file_not_valid(req: Request, res: Response, next: NextFunction) {
        res.statusCode = 400;
        res.send({
            message: "file type is not valid",
        });
    },
    cannot_remove_profile_photo(req: Request, res: Response, next: NextFunction) {
        res.statusCode = 503;
        res.send({
            message: "this profile_photo isn't yours",
        });
    },
    profile_photo_removed(req: Request, res: Response, next: NextFunction) {
        res.statusCode = 200;
        res.send({
            message: "profile_photo removed",
        });
    },
};
