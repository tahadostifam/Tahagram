"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// SECTION - events
const search_in_chats_1 = __importDefault(require("./search_in_chats"));
const users_1 = require("./users");
const chats_1 = require("./chats");
exports.default = {
    search_in_chats: search_in_chats_1.default,
    update_full_name: users_1.update_full_name,
    update_bio: users_1.update_bio,
    send_text_message: chats_1.send_text_message,
    delete_message: chats_1.delete_message,
    user_seened_message: chats_1.user_seened_message,
    get_chat_full_info: chats_1.getUserFullInfo,
    check_username_existly: chats_1.check_username_existly,
    get_chat_messages: chats_1.get_chat_messages,
    join_to_chat: chats_1.join_to_chat,
    get_last_seen: users_1.get_last_seen,
    delete_chat: chats_1.delete_chat,
    change_member_access: chats_1.change_member_access,
};
