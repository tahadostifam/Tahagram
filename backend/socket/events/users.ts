import { WebSocket } from "ws";
import User from "../../models/user";
import Chats from "../../models/chats";

export async function update_full_name(ws: any, parsedData: any) {
    if (parsedData.full_name && parsedData.full_name.trim() != "") {
        const update = await User.findOneAndUpdate(ws.user.username, {
            full_name: parsedData.full_name,
        });
        if (update) {
            ws.send(
                JSON.stringify({
                    message: "full_name updated",
                    full_name: parsedData.full_name,
                })
            );
        }
    }
}

export async function update_bio(ws: any, parsedData: any) {
    if (parsedData.bio && parsedData.bio.trim() != "") {
        const update = await User.findOneAndUpdate(ws.user.username, {
            bio: parsedData.bio,
        });
        if (update) {
            ws.send(
                JSON.stringify({
                    message: "bio updated",
                    bio: parsedData.bio,
                })
            );
        }
    }
}

export async function send_text_message(ws: any, parsedData: any) {
    if (parsedData.send_text_message_input && parsedData.send_text_message_input.trim() != "") {
        const chat = await Chats.findOne({
            username: parsedData.chat_username,
        });
        // ANCHOR
        if (chat) {
            console.log(":))))");
        } else {
            const new_chat = new Chats({
                username: "",
            });
        }
    }
}
