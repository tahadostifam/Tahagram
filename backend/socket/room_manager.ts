import crypto from "crypto";
import WebSocket from "ws";

const rooms: any = {};

export function createRoom(room_name: string) {
    return new Promise(async (success, error) => {
        for (const [key, value] of Object.entries(rooms)) {
            const item: any = value;
            if (item.room_name == room_name) {
                error("a room exists with this room_name");
            }
        }

        const room_id = crypto.randomBytes(12).toString("hex");
        rooms[room_id] = {
            room_name: room_name,
            clients: [],
        };
    });
}
