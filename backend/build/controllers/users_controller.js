"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserChatsMessages = exports.getUserChats = exports.verifyRefreshToken = exports.checkUsernameUniqueness = exports.signinUserWithUserPassword = void 0;
const bcrypt_1 = require("../lib/bcrypt");
const client_ip_1 = require("../lib/client_ip");
const slugify_1 = __importDefault(require("slugify"));
const status_codes_1 = __importDefault(require("../lib/status_codes"));
const store_1 = __importStar(require("../lib/store"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets = require("../configs/secrets.json");
const user_1 = __importDefault(require("../models/user"));
const chats_1 = __importDefault(require("../models/chats"));
const users_1 = require("../socket/events/users");
exports.default = {
    SigninAction: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const client_ip = (_a = (0, client_ip_1.clientIp)(req, res)) === null || _a === void 0 ? void 0 : _a.toString();
        if (client_ip) {
            signinUserWithUserPassword(req.body.username, req.body.password).then((user) => __awaiter(void 0, void 0, void 0, function* () {
                // success
                yield (0, store_1.setUserTokens)(req.body.username, "refresh", (0, client_ip_1.cleanIpDots)(client_ip)).then((refresh_token) => __awaiter(void 0, void 0, void 0, function* () {
                    // success
                    yield (0, store_1.setUserTokens)(req.body.username, "auth", (0, client_ip_1.cleanIpDots)(client_ip)).then((auth_token) => __awaiter(void 0, void 0, void 0, function* () {
                        const final_profile_photos = user.profile_photos.reverse();
                        yield getUserChats(user).then((chats) => {
                            getUserChatsMessages(req.body.username, user.chats).then((chats_messages) => {
                                status_codes_1.default.success_signin({
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
                                }, req, res, next);
                            });
                        });
                    }), () => status_codes_1.default.error(req, res, next));
                }), () => status_codes_1.default.error(req, res, next));
            }), (state) => {
                if (state == "not_found") {
                    status_codes_1.default.username_or_password_is_incorrect(req, res, next);
                }
                if (state == "error") {
                    status_codes_1.default.error(req, res, next);
                }
            });
        }
    }),
    SignupAction: (req, res, next) => {
        var _a;
        const client_ip = (_a = (0, client_ip_1.clientIp)(req, res)) === null || _a === void 0 ? void 0 : _a.toString();
        if (client_ip) {
            req.body.username = (0, slugify_1.default)(req.body.username, {
                lower: true,
                strict: false,
                locale: "vi",
            });
            checkUsernameUniqueness(req.body.username).then(() => {
                (0, bcrypt_1.makeHashPassword)(req.body.password).then((password_digest) => __awaiter(void 0, void 0, void 0, function* () {
                    const user = new user_1.default({
                        full_name: req.body.full_name,
                        username: req.body.username,
                        password_digest: password_digest,
                    });
                    yield user.save();
                    status_codes_1.default.user_created(req, res, next);
                }), () => status_codes_1.default.error(req, res, next));
            }, () => status_codes_1.default.username_already_registered(req, res, next));
        }
    },
    RefreshTokenAction: (req, res, next) => {
        var _a;
        const client_ip = (_a = (0, client_ip_1.clientIp)(req, res)) === null || _a === void 0 ? void 0 : _a.toString();
        if (client_ip) {
            try {
                verifyRefreshToken(req.body.refresh_token, (0, client_ip_1.cleanIpDots)(client_ip)).then((user_username) => __awaiter(void 0, void 0, void 0, function* () {
                    // valid
                    yield (0, store_1.setUserTokens)(user_username, "auth", (0, client_ip_1.cleanIpDots)(client_ip)).then((auth_token) => __awaiter(void 0, void 0, void 0, function* () {
                        // success
                        status_codes_1.default.success_signin({
                            auth_token: auth_token,
                        }, req, res, next);
                    }), () => status_codes_1.default.error(req, res, next));
                }), () => status_codes_1.default.invalid_token(req, res, next));
            }
            catch (error) {
                return status_codes_1.default.invalid_token(req, res, next);
            }
        }
    },
    AuthenticationAction: (req, res, next) => {
        var _a;
        const client_ip = (_a = (0, client_ip_1.clientIp)(req, res)) === null || _a === void 0 ? void 0 : _a.toString();
        if (client_ip) {
            const user_id_in_store = (0, store_1.makeUserStoreId)(req.body.username, "auth", (0, client_ip_1.cleanIpDots)(client_ip));
            store_1.default.get(user_id_in_store).then((token_in_store) => __awaiter(void 0, void 0, void 0, function* () {
                if (String(token_in_store).trim() == String(req.body.auth_token).trim()) {
                    // success | requested token is valid
                    const user = yield user_1.default.findOne({
                        username: req.body.username,
                    });
                    if (!user)
                        return status_codes_1.default.invalid_token(req, res, next);
                    const final_profile_photos = user.profile_photos.reverse();
                    yield getUserChats(user).then((chats) => {
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
                }
                else {
                    status_codes_1.default.invalid_token(req, res, next);
                }
            }));
        }
    },
};
function signinUserWithUserPassword(username, password) {
    return new Promise((success, failed) => __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.default.findOne({
            username: username,
        });
        if (!user) {
            return failed("not_found");
        }
        (0, bcrypt_1.comparePassword)(password, user.password_digest).then(() => {
            success(user);
        }, () => failed("not_found"));
    }));
}
exports.signinUserWithUserPassword = signinUserWithUserPassword;
function checkUsernameUniqueness(username) {
    return new Promise((deos_not_exists, exists) => __awaiter(this, void 0, void 0, function* () {
        const result = yield user_1.default.findOne({
            username: username,
        });
        if (result) {
            exists();
        }
        else {
            deos_not_exists();
        }
    }));
}
exports.checkUsernameUniqueness = checkUsernameUniqueness;
function verifyRefreshToken(token, client_ip) {
    return new Promise((valid, is_not_valid) => {
        jsonwebtoken_1.default.verify(token, secrets.refresh_token, (err, decoded_jwt_token) => {
            const user_id_in_store = (0, store_1.makeUserStoreId)(decoded_jwt_token.username, "refresh", (0, client_ip_1.cleanIpDots)(client_ip));
            if (err || !decoded_jwt_token)
                return is_not_valid();
            store_1.default.get(user_id_in_store).then((token_in_store) => __awaiter(this, void 0, void 0, function* () {
                if (String(token_in_store).trim() == String(token).trim()) {
                    // success | requested token is valid
                    valid(decoded_jwt_token.username);
                }
                else {
                    is_not_valid();
                }
            }));
        });
    });
}
exports.verifyRefreshToken = verifyRefreshToken;
function getUserChats(user) {
    return new Promise((success) => __awaiter(this, void 0, void 0, function* () {
        if (user) {
            if (user.chats.length == 0) {
                return success([]);
            }
            else {
                let chats = [];
                yield user.chats.forEach((item, index) => __awaiter(this, void 0, void 0, function* () {
                    const chat_info = yield chats_1.default.findById(item.chat_id);
                    if (chat_info) {
                        // going to detect that user target _id is in the user_1 or user_2
                        switch (chat_info.chat_type) {
                            case "private":
                                // now, we should get UserInfo from UserModel
                                const target_username = (0, users_1.findOutTUofChat)(chat_info, user.username);
                                if (target_username) {
                                    const target_user_info = yield user_1.default.findOne({
                                        username: target_username,
                                    });
                                    if (target_user_info) {
                                        let user_data = {
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
                                let user_data = {
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
                }));
            }
        }
        else {
            console.log("user not found in getUserChats function");
        }
    }));
}
exports.getUserChats = getUserChats;
function getUserChatsMessages(username, user_chats_list) {
    return new Promise((success) => __awaiter(this, void 0, void 0, function* () {
        let final_list = [];
        if (user_chats_list.length > 0) {
            return yield user_chats_list.forEach((item, index) => __awaiter(this, void 0, void 0, function* () {
                let chat = yield chats_1.default.findOne({
                    _id: item.chat_id,
                });
                chat = JSON.parse(JSON.stringify(chat));
                if (chat) {
                    const data = {
                        _id: chat._id,
                        full_name: chat.full_name,
                        username: chat.username,
                        creator_username: chat.creator_username,
                        chat_type: chat.chat_type,
                        messages_list: chat.messages_list,
                    };
                    if (chat.chat_type == "private") {
                        const target_username = (0, users_1.findOutTUofChat)(chat, username);
                        if (target_username) {
                            chat.target_username = target_username;
                        }
                        data["sides"] = chat.sides;
                    }
                    else if (chat.chat_type == "channel" || chat.chat_type == "group") {
                        // do not nothing
                    }
                    final_list.push(data);
                }
                // if forEach finished
                if (index == user_chats_list.length - 1) {
                    success(final_list);
                }
            }));
        }
        success([]);
    }));
}
exports.getUserChatsMessages = getUserChatsMessages;
