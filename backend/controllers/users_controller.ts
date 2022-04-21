import { Request, Response, NextFunction } from "express";
import { comparePassword, makeHashPassword } from "../lib/bcrypt";
import slugify from "slugify";
import status_codes from "../lib/status_codes";
const secrets = require("../configs/secrets.json");

import User from "../models/user";
import Chats from "../models/chats";
import { IChat, IUser, IUserChatLink } from "../lib/interfaces";
import { findOutTUofChat } from "../lib/socket";
import { sendMail } from "../mail/mail";
import { listenerCount } from "stream";

declare module "express-session" {
    interface SessionData {
        user_id: string;
    }
    interface Cookie {
        user_id: string;
    }
}

export default {
    SigninAction: async (req: Request, res: Response, next: NextFunction) => {
        const verific_code = RandomVerificCode();
        const email = (req.body.channel_username = slugify(req.body.email, {
            lower: true,
            strict: false,
            locale: "vi",
        }));
        const user: IUser = await User.findOne({
            email: email,
        });

        if (user) {
            if (user.verific_limit_date != null && isUserLimited(String(user.verific_limit_date))) {
                return status_codes.verific_code_limit(Date.parse(user.verific_limit_date), req, res, next);
            } else {
                await User.findOneAndUpdate(
                    { email: email },
                    {
                        verific_code: verific_code,
                        verific_code_expire: makeVerificCodeExpireDate(),
                        verific_limit_date: null,
                    }
                );
                doSendEmail();
            }
        } else {
            await new User({
                username: CleanEmailAt(email),
                email: email,
                verific_code: verific_code,
                verific_try_count: 0,
                verific_code_expire: makeVerificCodeExpireDate(),
            }).save();
            doSendEmail();
        }

        function doSendEmail() {
            status_codes.verific_email_sent(req, res, next);
            // Commented just in devel mode
            // sendMail(
            //     "verific",
            //     {
            //         name: CleanEmailAt(email),
            //         code: verific_code,
            //     },
            //     "mr.tahadostifam@gmail.com",
            //     "Logging In Account (First Time)"
            // )
            //     .then(async () => {

            //         status_codes.verific_email_sent(req, res, next);
            //     })
            //     .catch(() => {
            //         status_codes.error(req, res, next);
            //     });
        }
    },

    SigninWithCode: async (req: Request, res: Response, next: NextFunction) => {
        const email = req.body.email;
        const verific_code = req.body.verific_code;
        const user: IUser = await User.findOne({
            email: email,
        });

        async function response_bad_verific_code() {
            await User.findOneAndUpdate(
                {
                    email: email,
                },
                {
                    $inc: {
                        verific_try_count: 1,
                    },
                }
            );
            status_codes.bad_verific_code(req, res, next);
        }

        if (user) {
            const current_verific_code: number | undefined = user.verific_try_count;
            if (current_verific_code && Number(current_verific_code) >= 5) {
                await User.updateOne(
                    {
                        email: email,
                    },
                    {
                        verific_limit_date: makeVerificCodeExpireDate(),
                    }
                );

                status_codes.maximum_try_count(req, res, next);
            } else {
                try {
                    if (user.verific_code === parseInt(verific_code)) {
                        const verific_code_expire_date = user.verific_code_expire;

                        if (verific_code_expire_date && isVerificCodeExpired(String(verific_code_expire_date))) {
                            req.session.user_id = user._id;

                            res.send({ message: "success" });

                            // the input_code is valid | success!
                            await User.findOneAndUpdate(
                                {
                                    email: email,
                                },
                                {
                                    verific_code: null,
                                    verific_try_count: 0,
                                    verific_limit_date: null,
                                    first_login_filled: true,
                                }
                            );
                        } else {
                            status_codes.verific_code_expired(req, res, next);
                        }
                    } else {
                        response_bad_verific_code();
                    }
                } catch {
                    response_bad_verific_code();
                }
            }
        } else {
            response_bad_verific_code();
        }
    },

    AuthenticationAction: async (req: Request, res: Response, next: NextFunction) => {
        if (req.session.user_id) {
            const user: IUser = await User.findOne({
                _id: req.session.user_id,
            });
            if (!user) return status_codes.invalid_token(req, res, next);

            ResponseUserData(user, req, res, next);
        } else {
            status_codes.invalid_token(req, res, next);
        }
    },
};

async function ResponseUserData(user: IUser, req: Request, res: Response, next: NextFunction) {
    const final_profile_photos = user.profile_photos.reverse();
    await getUserChats(user).then((chats) => {
        getUserChatsMessages(req.body.username, user.chats).then((chats_messages) => {
            res.send({
                message: "success",
                data: {
                    email: user.email,
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
}

export function checkEmailUniqueness(email: string) {
    return new Promise<void>(async (does_not_exists: () => void, exists: () => void) => {
        const result = await User.findOne({
            email: email,
        });
        if (result) {
            exists();
        } else {
            does_not_exists();
        }
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
                                if (chat_info.members) {
                                    user_data["members"] = chat_info.members.length + 1;
                                }
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
                                        filename: chat_info.profile_photos.reverse()[0].filename,
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

export function RandomVerificCode(): number {
    const min = Math.ceil(100000);
    const max = Math.floor(999999);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function CleanEmailAt(email: string): string {
    return email.slice(0, email.indexOf("@"));
}

export function makeVerificCodeExpireDate() {
    let currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 10);
    return currentDate.toString();
}

export function isVerificCodeExpired(date: string) {
    if (!date) {
        return false;
    }
    return Date.parse(date) > Date.now();
}

export function isUserLimited(date: string) {
    if (!date) {
        return false;
    }
    return Date.parse(date) > Date.now();
}

export function makeUserLimitDate() {
    let currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 3);
    return currentDate.toString();
}
