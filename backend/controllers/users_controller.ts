import { Request, Response, NextFunction } from "express";
import { comparePassword, makeHashPassword } from "../lib/bcrypt";
import { clientIp, cleanIpDots } from "../lib/client_ip";
import * as database from "../lib/database";
import status_codes from "../lib/status_codes";
import store, { makeUserStoreId, setUserTokens } from "../lib/store";
import jwt from "jsonwebtoken";
const secrets = require("../configs/secrets.json");

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
                                    status_codes.success_signin(
                                        {
                                            user: user,
                                            refresh_token: refresh_token,
                                            auth_token: auth_token,
                                        },
                                        req,
                                        res,
                                        next
                                    );
                                },
                                () => status_codes.error(req, res, next)
                            );
                        },
                        () => status_codes.error(req, res, next)
                    );
                },
                (state) => {
                    if (state == "not_found") {
                        status_codes.username_or_password_is_incorrect(req, res, next);
                    }
                    if (state == "error") {
                        status_codes.error(req, res, next);
                    }
                }
            );
        }
    },

    SignupAction: (req: Request, res: Response, next: NextFunction) => {
        const client_ip = clientIp(req, res)?.toString();
        if (client_ip) {
            checkUsernameUniqueness(req.body.username).then(
                () => {
                    makeHashPassword(req.body.password).then(
                        (password_digest) => {
                            database
                                .exec_query("INSERT INTO tbl_users(full_name, username, password_digest) VALUES ($1, $2, $3)", [
                                    req.body.full_name,
                                    req.body.username,
                                    password_digest,
                                ])
                                .then(
                                    async () => {
                                        await setUserTokens(req.body.username, "refresh", cleanIpDots(client_ip)).then(
                                            async (refresh_token) => {
                                                // success
                                                await setUserTokens(req.body.username, "auth", cleanIpDots(client_ip)).then(
                                                    async (auth_token) => {
                                                        // success
                                                        status_codes.user_created(
                                                            {
                                                                refresh_token: refresh_token,
                                                                auth_token: auth_token,
                                                            },
                                                            req,
                                                            res,
                                                            next
                                                        );
                                                    },
                                                    () => status_codes.error(req, res, next)
                                                );
                                            },
                                            () => status_codes.error(req, res, next)
                                        );
                                    },
                                    () => status_codes.error(req, res, next)
                                );
                        },
                        () => status_codes.error(req, res, next)
                    );
                },
                () => status_codes.username_already_registered(req, res, next)
            );
        }
    },

    RefreshTokenAction: (req: Request, res: Response, next: NextFunction) => {
        const client_ip = clientIp(req, res)?.toString();
        if (client_ip) {
            try {
                verifyRefreshToken(req.body.refresh_token, cleanIpDots(client_ip)).then(
                    async () => {
                        // valid
                        await setUserTokens(req.body.username, "auth", cleanIpDots(client_ip)).then(
                            async (auth_token) => {
                                // success
                                status_codes.success_signin(
                                    {
                                        auth_token: auth_token,
                                    },
                                    req,
                                    res,
                                    next
                                );
                            },
                            () => status_codes.error(req, res, next)
                        );
                    },
                    () => status_codes.invalid_token(req, res, next)
                );
            } catch (error) {
                return status_codes.invalid_token(req, res, next);
            }
        }
    },

    AuthenticationAction: (req: Request, res: Response, next: NextFunction) => {
        const client_ip = clientIp(req, res)?.toString();
        if (client_ip) {
            const user_id_in_store = makeUserStoreId(req.body.username, "auth", cleanIpDots(client_ip));
            store.get(user_id_in_store).then(async (token_in_store) => {
                if (String(token_in_store).trim() == String(req.body.auth_token).trim()) {
                    // success | requested token is valid
                    database.exec_query("SELECT full_name, username, bio, last_seen from tbl_users WHERE username=$1", [req.body.username]).then(
                        (result: any) => {
                            if (result.length == 0) return status_codes.invalid_token(req, res, next);
                            else {
                                res.send({
                                    message: "success",
                                    data: result[0],
                                });
                            }
                        },
                        () => status_codes.invalid_token(req, res, next)
                    );
                } else {
                    status_codes.invalid_token(req, res, next);
                }
            });
        }
    },
};

export function signinUserWithUserPassword(username: string, password: string) {
    return new Promise((success: any, failed: any) => {
        database.exec_query("SELECT * FROM tbl_users WHERE username=$1", [username]).then(
            (result: any) => {
                if (result.length > 0) {
                    const user = result[0];
                    comparePassword(password, user.password_digest).then(
                        () => {
                            success(user);
                        },
                        () => failed("not_found")
                    );
                } else {
                    failed("not_found");
                }
            },
            () => failed("error")
        );
    });
}

export function checkUsernameUniqueness(username: string) {
    return new Promise((is_unique: any, is_not_unique: any) => {
        database.exec_query("SELECT username from tbl_users WHERE username=$1", [username]).then(
            (result: any) => {
                if (result.length == 0) is_unique();
                else is_not_unique();
            },
            () => is_not_unique()
        );
    });
}

export function verifyRefreshToken(token: string, client_ip: string) {
    return new Promise((valid: any, is_not_valid: any) => {
        jwt.verify(token, secrets.refresh_token, (err: any, decoded_jwt_token: any) => {
            const user_id_in_store = makeUserStoreId(decoded_jwt_token.username, "refresh", cleanIpDots(client_ip));
            if (err || !decoded_jwt_token) return is_not_valid();
            store.get(user_id_in_store).then(async (token_in_store) => {
                if (String(token_in_store).trim() == String(token).trim()) {
                    // success | requested token is valid
                    valid(decoded_jwt_token.username);
                } else {
                    is_not_valid();
                }
            });
        });
    });
}
