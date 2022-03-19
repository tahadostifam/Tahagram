import { IChat, IWebSocket } from "./interfaces";
import User from "../models/user";
import { rooms } from "../socket/socket";
import crypto from "crypto";

interface IRoomCallback {
    user_1: string;
    user_2: string;
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

async function userIsOnline(username: string) {
    await User.findOneAndUpdate(
        {
            username: username,
        },
        {
            last_seen: "online",
        }
    );
}

async function userIsOffline(username: string) {
    const last_online_time = Date.now();
    await User.findOneAndUpdate(
        {
            username: username,
        },
        {
            last_seen: last_online_time,
        }
    );
}

export function createPrivateRoom(room_id: string, user_1: string, user_2: string) {
    return new Promise(async (success: (room: IRoomCallback) => void, error) => {
        for (const [key, value] of Object.entries(rooms)) {
            const item: any = value;
            if (item.room_id == room_id) {
                error("a room exists with this room_name");
            }
        }

        const room: any = {
            user_1: user_1,
            user_2: user_2,
        };

        rooms[room_id] = room;

        success(room);
    });
}

export function setUserUUID(ws: IWebSocket) {
    ws["uuid"] = crypto.randomBytes(12).toString("hex");
}

export async function pushChatToUserChatsList(username: String, chat_id: string) {
    await User.updateOne(
        {
            username: username,
        },
        {
            $push: {
                chats: {
                    chat_id: chat_id, // the id of chat [chats collection]
                },
            },
        }
    );
}
