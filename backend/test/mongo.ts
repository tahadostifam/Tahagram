import { checkUsernameUniqueness } from "../controllers/users_controller";
import User from "../models/user";
import Chats from "../models/chats";
import { connect } from "../lib/database";
import mongoose from "mongoose";

console.clear();

async function main() {
    connect();

    // SECTION Making a private chat
    // const chat = new Chats({
    //     chat_type: "private",
    //     messages_list: [
    //         {
    //             sender_username: "maximilian",
    //             message_type: "text",
    //             send_time: Date.now(),
    //             content: "Hey Guys!",
    //             edited: false,
    //         },
    //     ],
    //     sides: {
    //         user_1: "maximilian",
    //         user_2: "luffy",
    //     },
    // });
    // await chat.save();
    // console.log("A private chat created.");

    // SECTION - add chat into user chats_list
    // const user = await User.findOneAndUpdate(
    //     {
    //         username: "maximilian",
    //     },
    //     {
    //         $push: {
    //             chats: {
    //                 chat_id: "61ebc82ce8515bea71daa202", // the id of chat [chats collection]
    //             },
    //         },
    //     }
    // );
}

main();
