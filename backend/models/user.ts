import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    full_name: String,
    username: String,
    password_digest: String,
    chats: [
        {
            username: String,
        },
    ],
});

export default mongoose.model("users", userSchema);
