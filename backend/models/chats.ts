import { ObjectId } from "mongodb";
import mongoose from "mongoose";

var schema = new mongoose.Schema({
    _id: {
        type: String,
        default: function () {
            return new ObjectId().toString();
        },
    },
    // SECTION - Private
    sides: {
        type: Object,
        unique: false,
        index: false,
    },
    // SECTION - Channel & Groups
    username: {
        type: String,
    },
    bio: {
        type: String,
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

var collection = mongoose.model("chats", schema);

export default collection;
