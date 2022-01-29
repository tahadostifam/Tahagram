import crypto from "crypto";
import WebSocket from "ws";
import { IRoomUser, IWebSocket } from "../lib/interfaces";
import { IPrivateRoom } from "../lib/interfaces";

// TODO
export let rooms: any = {};

interface IRoomCallback {
    user_1: string;
    user_2: string;
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
