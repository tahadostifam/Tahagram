import { Request, Response, NextFunction } from "express";
import { comparePassword, makeHashPassword } from "../lib/bcrypt";
import { clientIp, cleanIpDots } from "../lib/client_ip";
import slugify from "slugify";
import status_codes from "../lib/status_codes";
import store, { makeUserStoreId, setUserTokens } from "../lib/store";
import jwt from "jsonwebtoken";
const secrets = require("../configs/secrets.json");

import User from "../models/user";
import Chats from "../models/chats";
import { IChat, IUser, IUserChatLink } from "../lib/interfaces";
import { findOutTUofChat } from "../socket/events/users";

export default {
    SigninAction: async (req: Request, res: Response, next: NextFunction) => {
        const client_ip = clientIp(req, res)?.toString();

        if (client_ip) {
            signinUserWithUserPassword(req.body.username, req.body.password).then(
                async (user: IUser) => {
                    // success
                    await setUserTokens(req.body.username, "refresh", cleanIpDots(client_ip)).then(
                        async (refresh_token) => {
                            // success
                            await setUserTokens(req.body.username, "auth", cleanIpDots(client_ip)).then(
                                async (auth_token) => {
                                    const final_profile_photos = user.profile_photos.reverse();
                                    await getUserChats(user).then((chats) => {
                                        getUserChatsMessages(req.body.username, user.chats).then((chats_messages) => {
                                            status_codes.success_signin(
                                                {
                                                    user: {
                                                        full_name: user.full_name,
                                                        username: user.username,
                                                        bio: user.bio,
                                                        last_seen: user.last_seen,
                                                        profile_photos: final_profile_photos,
                                                        chats: chats,
                                                        chats_messages: chats_messages,
                                                    },
                                                    refresh_token: refresh_token,
                                                    auth_token: auth_token,
                                                },
                                                req,
                                                res,
                                                next
                                            );
                                        });
                                    });
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
            req.body.username = slugify(req.body.username, {
                lower: true,
                strict: false,
                locale: "vi",
            });

            checkUsernameUniqueness(req.body.username).then(
                () => {
                    makeHashPassword(req.body.password).then(
                        async (password_digest) => {
                            const user = new User({
                                full_name: req.body.full_name,
                                username: req.body.username,
                                password_digest: password_digest,
                            });
                            await user.save();
                            status_codes.user_created(req, res, next);
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
                    async (user_username: string) => {
                        // valid
                        await setUserTokens(user_username, "auth", cleanIpDots(client_ip)).then(
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
                    const user = await User.findOne({
                        username: req.body.username,
                    });
                    if (!user) return status_codes.invalid_token(req, res, next);
                    const final_profile_photos = user.profile_photos.reverse();
                    await getUserChats(user).then((chats) => {
                        getUserChatsMessages(req.body.username, user.chats).then((chats_messages) => {
                            res.send({
                                message: "success",
                                data: {
                                    full_name: user.full_name,
                                    username: user.username,
                                    bio: user.bio,
                                    last_seen: user.last_seen,
                                    profile_photos: final_profile_photos,
                                    chats: chats,
                                    chats_messages: chats_messages,
                                },
                            });
                        });
                    });
                } else {
                    status_codes.invalid_token(req, res, next);
                }
            });
        }
    },
};

export function signinUserWithUserPassword(username: string, password: string) {
    return new Promise(async (success: (user: IUser) => void, failed: (message: string) => void) => {
        const user = await User.findOne({
            username: username,
        });

        if (!user) {
            return failed("not_found");
        }
        comparePassword(password, user.password_digest).then(
            () => {
                success(user);
            },
            () => failed("not_found")
        );
    });
}

export function checkUsernameUniqueness(username: string) {
    return new Promise(async (deos_not_exists: any, exists: any) => {
        const result = await User.findOne({
            username: username,
        });
        if (result) {
            exists();
        } else {
            deos_not_exists();
        }
    });
}

export function verifyRefreshToken(token: string, client_ip: string) {
    return new Promise((valid: (user_username: string) => void, is_not_valid: () => void) => {
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

export function getUserChats(user: IUser) {
    return new Promise(async (success) => {
        if (user) {
            if (user.chats.length == 0) {
                return success([]);
            } else {
                let chats: Array<object> = [];
                interface IGetUserChatsChatI extends IChat {
                    profile_photos: any;
                }
                await user.chats.forEach(async (item: any, index: number) => {
                    const chat_info: IGetUserChatsChatI = await Chats.findById(item.chat_id);

                    if (chat_info) {
                        // going to detect that user target _id is in the user_1 or user_2
                        switch (chat_info.chat_type) {
                            case "private":
                                // now, we should get UserInfo from UserModel
                                const target_username = findOutTUofChat(chat_info, user.username);
                                if (target_username) {
                                    const target_user_info = await User.findOne({
                                        username: target_username,
                                    });
                                    if (target_user_info) {
                                        let user_data: any = {
                                            chat_id: item.chat_id,
                                            full_name: target_user_info.full_name,
                                            username: target_user_info.username,
                                            chat_type: chat_info.chat_type,
                                        };
                                        if (target_user_info.profile_photos.length > 0) {
                                            const profile_photos = target_user_info.profile_photos.reverse();
                                            user_data["profile_photo"] = profile_photos[0];
                                        }
                                        chats.push(user_data);
                                    }
                                }
                                break;
                            case "channel":
                            case "group":
                                let user_data: any = {
                                    chat_id: chat_info._id,
                                    full_name: chat_info.full_name,
                                    username: chat_info.username,
                                    chat_type: chat_info.chat_type,
                                };
                                if (chat_info.admins) {
                                    const iam_admin_of_chat = chat_info.admins.includes(user.username);
                                    const iam_creator_of_chat = chat_info.creator_username == user.username;
                                    user_data["iam_admin_of_chat"] = iam_admin_of_chat || iam_creator_of_chat;
                                }
                                if (user_data["iam_admin_of_chat"] != true && chat_info.members) {
                                    const iam_amember_of_chat = chat_info.members.includes(user.username);
                                    user_data["iam_amember_of_chat"] = iam_amember_of_chat;
                                }
                                if (chat_info.profile_photos && chat_info.profile_photos.length > 0 && chat_info.profile_photos[0].filename) {
                                    user_data["profile_photo"] = {
                                        filename: chat_info.profile_photos[0].filename,
                                    };
                                }
                                chats.push(user_data);
                                break;
                        }
                    }

                    if (index == user.chats.length - 1) {
                        success(chats);
                    }
                });
            }
        } else {
            console.log("user not found in getUserChats function");
        }
    });
}

export function getUserChatsMessages(username: string, user_chats_list: IUserChatLink[]) {
    return new Promise(async (success) => {
        let final_list: Array<IChat> = [];
        if (user_chats_list.length > 0) {
            return await user_chats_list.forEach(async (item: IUserChatLink, index: number) => {
                let chat: IChat = await Chats.findOne({
                    _id: item.chat_id,
                });
                chat = JSON.parse(JSON.stringify(chat));
                if (chat) {
                    const data: any = {
                        _id: chat._id,
                        full_name: chat.full_name,
                        username: chat.username,
                        creator_username: chat.creator_username,
                        chat_type: chat.chat_type,
                        messages_list: chat.messages_list,
                    };
                    if (chat.chat_type == "private") {
                        const target_username = findOutTUofChat(chat, username);
                        if (target_username) {
                            chat.target_username = target_username;
                        }
                        data["sides"] = chat.sides;
                    } else if (chat.chat_type == "channel" || chat.chat_type == "group") {
                        // do not nothing
                    }
                    final_list.push(data);
                }
                // if forEach finished
                if (index == user_chats_list.length - 1) {
                    success(final_list);
                }
            });
        }
        success([]);
    });
}
