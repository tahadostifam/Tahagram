import { checkUsernameUniqueness } from "../controllers/users_controller";
import User from "../models/user";
import Chats from "../models/chats";
import { connect } from "../lib/database";
import mongoose from "mongoose";

console.clear();

async function main() {
    connect();

    // NOTE Making a private chat
    const chat = new Chats({
        chat_type: "private",
        messages_list: [
            {
                sender_username: "maximilian",
                message_type: "text",
                send_time: Date.now(),
                content: "Hey max, Whatsup?",
                edited: false,
            },
        ],
        sides: {
            user_1: "maximilian",
            user_2: "rocks_crew",
        },
    });

    await chat.save();

    console.log("A private chat created.");

    // const user = await User.findOneAndUpdate(
    //     {
    //         username: "maximilian",
    //     },
    //     {
    //         $push: {
    //             chats: {
    //                 user_id: "61e41439eff84037be819e9e",
    //             },
    //         },
    //     }
    // );
}

main();
