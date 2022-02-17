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
exports.get_last_seen = exports.findOutTUofChat = exports.update_bio = exports.update_full_name = void 0;
const user_3 = __importDefault(require("../../models/user"));
function update_full_name(ws, parsedData) {
    return __awaiter(this, void 0, void 0, function* () {
        if (parsedData.full_name && parsedData.full_name.trim() != "") {
            const update = yield user_3.default.findOneAndUpdate({
                username: ws.user.username,
            }, {
                full_name: parsedData.full_name,
            });
            if (update) {
                ws.send(JSON.stringify({
                    message: "full_name updated",
                    full_name: parsedData.full_name,
                }));
            }
        }
    });
}
exports.update_full_name = update_full_name;
function update_bio(ws, parsedData) {
    return __awaiter(this, void 0, void 0, function* () {
        if (parsedData.bio && parsedData.bio.trim() != "") {
            const update = yield user_3.default.findOneAndUpdate({
                username: ws.user.username,
            }, {
                bio: parsedData.bio,
            });
            if (update) {
                ws.send(JSON.stringify({
                    message: "bio updated",
                    bio: parsedData.bio,
                }));
            }
        }
    });
}
exports.update_bio = update_bio;
function findOutTUofChat(chat, username) {
    var _a, _b, _c, _d;
    if (((_a = chat.sides) === null || _a === void 0 ? void 0 : _a.user_1) != username) {
        return (_b = chat.sides) === null || _b === void 0 ? void 0 : _b.user_1;
    }
    else if (((_c = chat.sides) === null || _c === void 0 ? void 0 : _c.user_2) != username) {
        return (_d = chat.sides) === null || _d === void 0 ? void 0 : _d.user_2;
    }
    else {
        return null;
    }
}
exports.findOutTUofChat = findOutTUofChat;
function get_last_seen(ws, parsedData) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = parsedData.username;
        if (username && username.length > 0) {
            const user = yield user_3.default.findOne({
                username: parsedData.username,
            });
            if (user) {
                ws.send(JSON.stringify({
                    event: "get_last_seen",
                    username: parsedData.username,
                    last_seen: user.last_seen,
                }));
            }
        }
    });
}
exports.get_last_seen = get_last_seen;
