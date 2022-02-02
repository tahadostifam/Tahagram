import User from "../../models/user";
import Chats from "../../models/chats";
import { createPrivateRoom, rooms } from "../room_manager";
import { IWebSocket } from "../../lib/interfaces";

export async function create_channel(ws: IWebSocket, parsedData: any) {
    const channel_username = parsedData.channel_username;
}
