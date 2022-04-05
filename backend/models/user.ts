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
    },
    email: {
        type: String,
        required: true, 
        unique: true,
    },
    verific_code: {
        type: Number
    },
    verific_try_count: {
        type: Number, 
    },
    verific_limit_date: {
        type: Date,
    },
    first_login_filled: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        unique: true,        
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
