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
exports.photo_messages_directory = void 0;
const status_codes_1 = __importDefault(require("../lib/status_codes"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const profile_photos_controller_1 = require("./profile_photos_controller");
const socket_1 = require("../socket/socket");
const user_1 = __importDefault(require("../models/user"));
const mongodb_1 = require("mongodb");
const chats_1 = require("../socket/events/chats");
exports.photo_messages_directory = "/uploads/photo_messages/";
exports.default = {
    NewPhotoMessageAction: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const chat_id = req.body.chat_id;
        const chat_type = req.body.chat_type;
        const target_username = req.body.target_username;
        const caption = req.body.caption;
        if (!req.files || !req.files["photo"]) {
            res.statusCode = 400;
            return res.send({
                errors: [
                    {
                        msg: "Photo can't be empty",
                        param: "photo",
                        location: "body",
                    },
                ],
            });
        }
        const photo = req.files["photo"];
        if ((0, profile_photos_controller_1.justImageFile)(photo)) {
            const user = yield user_1.default.findOne({
                username: req.headers.username,
            });
            if (!user)
                return status_codes_1.default.invalid_token(req, res, next);
            else {
                console.log("invalid token");
            }
            var final_filename = "";
            function generateRandomFileName() {
                return __awaiter(this, void 0, void 0, function* () {
                    final_filename = yield crypto_1.default.randomBytes(10).toString("hex");
                    if (fs_1.default.existsSync(exports.photo_messages_directory + final_filename)) {
                        console.log("bad filename :)");
                        yield generateRandomFileName();
                    }
                });
            }
            yield generateRandomFileName();
            try {
                if (final_filename && final_filename.trim().length != 0) {
                    const message = {
                        message_id: new mongodb_1.ObjectId().toString(),
                        sender_username: user.username,
                        message_type: "photo",
                        send_time: Date.now(),
                        edited: false,
                        seen_state: "sended",
                        filename: final_filename,
                    };
                    if (caption && caption.length > 0) {
                        message.caption = caption;
                    }
                    yield photo.mv(process.cwd() + exports.photo_messages_directory + String(final_filename));
                    const user_ws = socket_1.users.find(({ username: _username_ }) => user.username);
                    if (user_ws && user_ws.ws) {
                        (0, chats_1.handle_messages_socket)(chat_id, chat_type, target_username, user_ws.ws, message);
                    }
                }
                else {
                    console.log("final_filename is empty!");
                }
            }
            catch (_a) {
                status_codes_1.default.error(req, res, next);
            }
        }
        else {
            status_codes_1.default.file_not_valid(req, res, next);
        }
    }),
};
