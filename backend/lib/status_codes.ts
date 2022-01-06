import { Request, Response, NextFunction } from "express";

export default {
    user_created(data: any, req: Request, res: Response, next: NextFunction) {
        res.send({
            message: "user created successfully",
            tokens: {
                refresh_token: data.refresh_token,
                auth_token: data.auth_token,
            },
        });
    },
    success_signin(data: any, req: Request, res: Response, next: NextFunction) {
        res.send({
            message: "success",
            data: data.user,
            tokens: {
                refresh_token: data.refresh_token,
                auth_token: data.auth_token,
            },
        });
    },
    username_or_password_is_incorrect(req: Request, res: Response, next: NextFunction) {
        res.statusCode = 401;
        res.send({
            message: "username or password is incorrect",
        });
    },
    error(req: Request, res: Response, next: NextFunction) {
        res.statusCode = 500;
        res.send({
            message: "an error occurred on the server side",
        });
    },
    username_already_registered(req: Request, res: Response, next: NextFunction) {
        res.statusCode = 409;
        res.send({
            message: "Username already registered",
        });
    },
};
