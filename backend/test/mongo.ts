import { checkUsernameUniqueness } from "../controllers/users_controller";
import User from "../models/user";
import Chats from "../models/chats";
import UserHaveChat from "../models/user_have_chats";
import { connect } from "../lib/database";

console.clear();

async function main() {
    connect();

    const chats = await UserHaveChat.find({
        haver_uuid: "5427c4fd1184f2f2b657cb0f",
    });

    User.find()
        .populate("user_have_chats")
        .exec((err, users) => {
            if (err) throw err;
            var join_result = [];
            users.forEach(function (user) {
                user.friends.forEach(function (friend: any) {
                    console.log(friend);
                });
            });
        });

    console.log("Chat Added");
}

main();
