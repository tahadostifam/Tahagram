import { Request, Response, NextFunction } from "express";
import * as database from "../lib/database";

export default {
    SigninAction: (req: Request, res: Response, next: NextFunction) => {
        database.exec_query("SELECT NOW()", []).then(
            (result) => {
                res.send(result);
            },
            () => {
                res.send("error");
            }
        );
        next();
    },

    SignupAction: (req: Request, res: Response, next: NextFunction) => {},
};
