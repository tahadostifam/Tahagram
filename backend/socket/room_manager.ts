import crypto from "crypto";
import WebSocket from "ws";
import { IWebSocket } from "../lib/interfaces";
import { IPrivateRoom } from "../lib/interfaces";

// TODO
export let rooms: any = {};

export function createPrivateRoom(room_name: string, user_1: { username: string; ws: IWebSocket }, user_2: { username: string; ws: IWebSocket }) {
    return new Promise(async (success, error) => {
        for (const [key, value] of Object.entries(rooms)) {
            const item: any = value;
            if (item.room_name == room_name) {
                error("a room exists with this room_name");
            }
        }

        const room_id = await crypto.randomBytes(12).toString("hex");

        const room: IPrivateRoom = {
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
