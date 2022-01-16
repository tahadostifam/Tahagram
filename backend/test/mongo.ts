import { checkUsernameUniqueness } from "../controllers/users_controller";
import User from "../models/user";
import Chats from "../models/chats";
import { connect } from "../lib/database";
import mongoose from "mongoose";

console.clear();

async function main() {
    connect();

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

    const user: any = await User.findOne({
        username: "maximilian",
    });

    let chats: Array<object> = [];
    await user.chats.forEach(async (item: any, index: number) => {
        const chat_info = await User.findById(item.user_id);

        if (chat_info) {
            let user_data: any = {
                full_name: chat_info.full_name,
                username: chat_info.username,
            };
            if (user.profile_photos.length > 0) {
                user_data["profile_photo"] = user.profile_photos[0];
            }
            chats.push(user_data);
        }

        if (index == user.chats.length - 1) {
            console.log(chats);
        }
    });
}

main();
