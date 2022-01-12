import mongoose from "mongoose";

var schema = new mongoose.Schema({
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
    chats: {
        type: Array,
        default: [],
    },
});

var collection = mongoose.model("users", schema);

export default collection;
