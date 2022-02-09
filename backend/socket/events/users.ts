import User from "../../models/user";
import { IChat, IUser, IWebSocket } from "../../lib/interfaces";

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

export async function get_last_seen(ws: IWebSocket, parsedData: any) {
    const username = parsedData.username;
    if (username && username.length > 0) {
        const user: IUser = await User.findOne({
            username: parsedData.username,
        });
        if (user) {
            ws.send(
                JSON.stringify({
                    event: "get_last_seen",
                    username: parsedData.username,
                    last_seen: user.last_seen,
                })
            );
        }
    }
}
