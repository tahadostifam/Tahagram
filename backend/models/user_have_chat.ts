import mongoose from "mongoose";

var schema = new mongoose.Schema({
    haver_uuid: {
        type: String,
        required: true,
    },
    user_uuid: {
        type: String,
        required: true,
    },
});

var collection = mongoose.model("user_have_chat", schema);

export default collection;
