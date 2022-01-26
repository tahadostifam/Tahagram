import User from "../../models/user";
import Chats from "../../models/chats";
import { ObjectId } from "mongodb";
import { response } from "express";

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
    const chat_id = parsedData.chat_id;
    const message_text = parsedData.send_text_message_input;

    if (message_text && message_text.trim() != "" && chat_id && chat_id.trim() != "") {
        const message_id = new ObjectId().toString();
        const message = {
            message_id: message_id,
            sender_username: ws.user.username,
            message_type: "text",
            send_time: Date.now(),
            content: message_text,
            edited: false,
            my_message: true,
        };
        async function pushMessage(response: object) {
            const result = await Chats.findOneAndUpdate(
                { _id: chat_id },
                {
                    $push: {
                        messages_list: message,
                    },
                }
            );

            ws.send(JSON.stringify(response));
        }

        let chat = await Chats.findById(chat_id);
        if (chat) {
            pushMessage({
                event: "send_text_message",
                chat_id: chat_id,
                message: "message sended",
                message_callback: message,
            });
        } else {
            // we must create a new private_chat
            const target_username = parsedData.target_username;
            if (target_username && target_username.length > 0) {
                const chat = new Chats({
                    chat_type: "private",
                    messages_list: message,
                    sides: {
                        user_1: ws.user.username,
                        user_2: target_username,
                    },
                });
                await chat.save();
                // Add this chat into user_1 and user_2 chats_list
                pushMessage({
                    chat_created: {
                        chat_id: chat._id,
                    },
                    event: "send_text_message",
                    chat_id: chat_id,
                    message: "message sended",
                    message_callback: message,
                });
                console.log("chat_created", chat);
            }
        }
    }
}
