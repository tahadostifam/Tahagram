"use strict";
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
exports.checkUsernameUniqueness = void 0;
const profile_photos_controller_1 = require("./profile_photos_controller");
const status_codes_1 = __importDefault(require("../lib/status_codes"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const user_1 = __importDefault(require("../models/user"));
const chats_1 = __importDefault(require("../models/chats"));
const slugify_1 = __importDefault(require("slugify"));
exports.default = {
    CreateChannelAction: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_1.default.findOne({
            username: req.headers.username,
        });
        if (!user)
            return status_codes_1.default.invalid_token(req, res, next);
        req.body.channel_username = (0, slugify_1.default)(req.body.channel_username, {
            lower: true,
            strict: false,
            locale: "vi",
        });
        checkUsernameUniqueness(req.body.channel_username).then(() => __awaiter(void 0, void 0, void 0, function* () {
            // username is unique | ok
            var final_profile_photo_filename;
            if (req.files && req.files["profile_photo"]) {
                // user wanna create a channel with profile_photo
                const photo = req.files["profile_photo"];
                function generateRandomFileName() {
                    return __awaiter(this, void 0, void 0, function* () {
                        final_profile_photo_filename = yield crypto_1.default.randomBytes(15).toString("hex");
                        if (fs_1.default.existsSync(profile_photos_controller_1.profile_photos_directory + final_profile_photo_filename)) {
                            console.log("bad filename :)");
                            yield generateRandomFileName();
                        }
                    });
                }
                yield generateRandomFileName();
                try {
                    yield photo.mv(process.cwd() + "/uploads/profile_photos/" + final_profile_photo_filename);
                }
                catch (_a) {
                    final_profile_photo_filename = undefined;
                    return status_codes_1.default.error(req, res, next);
                }
            }
            let channel_data = {
                chat_type: "channel",
                username: req.body.channel_username,
                full_name: req.body.channel_name,
                creator_username: req.headers.username,
                members: [],
            };
            if (final_profile_photo_filename) {
                channel_data["profile_photos"] = {
                    filename: final_profile_photo_filename,
                };
            }
            if (req.body.bio && req.body.bio.length > 0) {
                channel_data["bio"] = req.body.bio;
            }
            const channel = new chats_1.default(channel_data);
            yield channel.save();
            yield user_1.default.updateOne({
                username: req.headers.username,
            }, {
                $push: {
                    chats: {
                        chat_id: channel._id,
                    },
                },
            });
            let data_to_send = {
                chat_id: channel._id,
            };
            if (final_profile_photo_filename) {
                data_to_send["profile_photo"] = final_profile_photo_filename;
            }
            status_codes_1.default.channel_created(data_to_send, req, res, next);
        }), () => {
            status_codes_1.default.username_is_not_unique(req, res, next);
        });
    }),
    CreateGroupAction: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_1.default.findOne({
            username: req.headers.username,
        });
        if (!user)
            return status_codes_1.default.invalid_token(req, res, next);
        checkUsernameUniqueness(req.body.group_username).then(() => __awaiter(void 0, void 0, void 0, function* () {
            // username is unique | ok
            const creator_info = {
                full_name: user.full_name,
                username: user.username,
                position: "creator",
                last_seen: user.last_seen,
            };
            if (user.profile_photos && user.profile_photos.length > 0) {
                creator_info.profile_photos = [user.profile_photos[user.profile_photos.length - 1]];
            }
            const group = new chats_1.default({
                chat_type: "group",
                username: req.body.group_username,
                full_name: req.body.group_name,
                creator_username: req.headers.username,
                members: [],
            });
            yield group.save();
            yield user_1.default.updateOne({
                username: req.headers.username,
            }, {
                $push: {
                    chats: {
                        chat_id: group._id,
                    },
                },
            });
            status_codes_1.default.group_created({
                members: [creator_info],
            }, req, res, next);
        }), () => {
            status_codes_1.default.username_is_not_unique(req, res, next);
        });
    }),
};
function checkUsernameUniqueness(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((is_unique, is_not_unique) => __awaiter(this, void 0, void 0, function* () {
            const channel = yield chats_1.default.findOne({
                username: username,
            });
            if (channel) {
                return is_not_unique();
            }
            is_unique();
        }));
    });
}
exports.checkUsernameUniqueness = checkUsernameUniqueness;
