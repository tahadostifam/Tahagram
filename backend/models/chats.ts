import mongoose from "mongoose";

var schema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    chat_type: {
        type: String,
        required: true,
    },
    messages_list: {
        type: Array,
        default: [],
    },
    bio: {
        type: String,
    },
});

var collection = mongoose.model("chats", schema);

export default collection;
