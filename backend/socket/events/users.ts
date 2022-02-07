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
