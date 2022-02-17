"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
var schema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        default: function () {
            return new mongodb_1.ObjectId().toString();
        },
    },
    // SECTION - Private
    sides: {
        type: Object,
        unique: false,
        index: true,
    },
    // SECTION - Channel & Groups
    full_name: {
        type: String,
    },
    username: {
        type: String,
        index: true,
    },
    bio: {
        type: String,
    },
    profile_photos: {
        type: Array,
    },
    creator_username: {
        type: String,
    },
    members: {
        type: Array,
    },
    admins: {
        type: Array,
    },
    // SECTION - Common
    chat_type: {
        type: String,
        required: true,
    },
    messages_list: {
        type: Array,
        default: [],
    },
});
var collection = mongoose_1.default.model("chats", schema);
exports.default = collection;
