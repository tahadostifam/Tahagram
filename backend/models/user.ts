import { ObjectId } from "mongodb";
import mongoose from "mongoose";

var schema = new mongoose.Schema({
    _id: {
        type: String,
        default: function () {
            return new ObjectId().toString();
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

var collection = mongoose.model("users", schema);

export default collection;
