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
exports.setUserUUID = exports.createPrivateRoom = exports.rooms = void 0;
const crypto_1 = __importDefault(require("crypto"));
// TODO
exports.rooms = {};
function createPrivateRoom(room_id, user_1, user_2) {
    return new Promise((success, error) => __awaiter(this, void 0, void 0, function* () {
        for (const [key, value] of Object.entries(exports.rooms)) {
            const item = value;
            if (item.room_id == room_id) {
                error("a room exists with this room_name");
            }
        }
        const room = {
            user_1: user_1,
            user_2: user_2,
        };
        exports.rooms[room_id] = room;
        success(room);
    }));
}
exports.createPrivateRoom = createPrivateRoom;
function setUserUUID(ws) {
    ws["uuid"] = crypto_1.default.randomBytes(12).toString("hex");
}
exports.setUserUUID = setUserUUID;
