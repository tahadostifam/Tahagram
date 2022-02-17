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
    full_name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password_digest: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: null,
    },
    last_seen: {
        type: String,
    },
    chats: {
        type: Array,
        default: [],
    },
    profile_photos: {
        type: Array,
        default: [],
    },
});
var collection = mongoose_1.default.model("users", schema);
exports.default = collection;
