import User from "../../models/user";
import Chats from "../../models/chats";
import { ObjectId } from "mongodb";
import { createPrivateRoom, rooms } from "../room_manager";

import { IChat, ISocketClient, IWebSocket } from "../../lib/interfaces";
import { users } from "../socket";

export async function update_full_name(ws: IWebSocket, parsedData: any) {
    if (parsedData.full_name && parsedData.full_name.trim() != "") {
        const update = await User.findOneAndUpdate(
            {
                username: ws.user.username,
            },
            {
                full_name: parsedData.full_name,
            }
        );
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

export async function update_bio(ws: IWebSocket, parsedData: any) {
    if (parsedData.bio && parsedData.bio.trim() != "") {
        const update = await User.findOneAndUpdate(
            {
                username: ws.user.username,
            },
            {
                bio: parsedData.bio,
            }
        );
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

export async function delete_message(ws: IWebSocket, parsedData: any) {
    const chat_id = parsedData.chat_id;
    const _message_id = parsedData.message_id;
    if (chat_id && chat_id.length > 0 && _message_id && _message_id.length > 0) {
        const chat = await Chats.findById(chat_id);
        if (chat) {
            const messages: Array<any> = chat.messages_list;
            const message_id_exists = messages.find(({ message_id }) => message_id === _message_id);

            if (message_id_exists) {
                await Chats.updateOne(
                    { _id: chat_id },
                    {
                        $pull: {
                            messages_list: {
                                message_id: _message_id,
                            },
                        },
                    }
                );
                ws.send(
                    JSON.stringify({
                        message: "message deleted",
                        chat_id: chat_id,
                        message_id: _message_id,
                    })
                );

                const target_username = findOutTUofChat(chat, ws.user.username);
                const target_ws = users.find(({ username: _username_ }) => _username_ === target_username);
                if (target_ws) {
                    target_ws.ws.send(
                        JSON.stringify({
                            message: "message deleted",
                            chat_id: chat_id,
                            message_id: _message_id,
                        })
                    );
                }
            }
        }
    }
}

export function findOutTUofChat(chat: IChat, username: string) {
    if (chat.sides?.user_1 != username) {
        return chat.sides?.user_1;
    } else if (chat.sides?.user_2 != username) {
        return chat.sides?.user_2;
    } else {
        return null;
    }
}

export async function getUserFullInfo(ws: IWebSocket, parsedData: any) {
    const target_username = parsedData.target_username;
    if (target_username && target_username.length > 0 && target_username != ws.user.username) {
        const user = await User.findOne({
            username: target_username,
        });
        if (user) {
            const profile_photos = user.profile_photos.reverse();
            let user_info_to_send: any = {
                event: "get_user_full_info",
                user_info: {
                    full_name: user.full_name,
                    username: user.username,
                    bio: user.bio,
                    profile_photos: profile_photos,
                },
            };
            ws.send(JSON.stringify(user_info_to_send));
        }
    }
}
