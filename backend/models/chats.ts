import mongoose from "mongoose";

var schema = new mongoose.Schema({
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
