import { Request, Response, NextFunction } from "express";

export default {
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
};
