import mongoose from "mongoose";

var schema = new mongoose.Schema({
    // SECTION - Private
    sides: {
        type: Object,
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
