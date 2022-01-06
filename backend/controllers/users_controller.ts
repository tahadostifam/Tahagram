import { Request, Response, NextFunction } from "express";
import { comparePassword, makeHashPassword } from "../lib/bcrypt";
import { clientIp, cleanIpDots } from "../lib/client_ip";
import * as database from "../lib/database";
import status_codes from "../lib/status_codes";
import store, { makeUserStoreId, setUserTokens } from "../lib/store";

export default {
    SigninAction: async (req: Request, res: Response, next: NextFunction) => {
        const client_ip = clientIp(req, res)?.toString();

        if (client_ip) {
            signinUserWithUserPassword(req.body.username, req.body.password).then(
                async (user: any) => {
                    // success
                    delete user["password_digest"];

                    await setUserTokens(req.body.username, "refresh", cleanIpDots(client_ip)).then(
                        async (refresh_token) => {
                            // success
                            await setUserTokens(req.body.username, "auth", cleanIpDots(client_ip)).then(
                                async (auth_token) => {
                                    // success
                                    res.send({
                                        message: "success",
                                        data: user,
                                        tokens: {
                                            refresh_token: refresh_token,
                                            auth_token: auth_token,
                                        },
                                    });
                                },
                                () => status_codes.error(req, res, next)
                            );
                        },
                        () => status_codes.error(req, res, next)
                    );
                },
                () => status_codes.username_or_password_is_incorrect(req, res, next)
            );
        }
    },

    SignupAction: (req: Request, res: Response, next: NextFunction) => {},
};

export function signinUserWithUserPassword(username: string, password: string) {
    return new Promise((success: any, failed: any) => {
        database.exec_query("SELECT * FROM tbl_users WHERE username=$1", [username]).then(
            (result: any) => {
                const user = result[0];
                comparePassword(password, user.password_digest).then(
                    () => {
                        success(user);
                    },
                    () => failed("not_found")
                );
            },
            () => failed("error")
        );
    });
}
