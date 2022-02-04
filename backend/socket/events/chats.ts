import User from "../../models/user";
import Chats from "../../models/chats";
import { createPrivateRoom, rooms } from "../room_manager";
import { IWebSocket } from "../../lib/interfaces";

export async function create_channel(ws: IWebSocket, parsedData: any) {
    const channel_username = parsedData.channel_username;
}

export async function check_username_existly(ws: IWebSocket, parsedData: any) {
    const username = parsedData.username;
    if (username && username.length > 0) {
        const chat = await Chats.findOne({
            username: username,
        });
        const user = await User.findOne({
            username: username,
        });
        if (chat || user) {
            ws.send(
                JSON.stringify({
                    message: "chat exists",
                    username: username,
                })
            );
        } else {
            ws.send(
                JSON.stringify({
                    message: "chat not exists",
                    username: username,
                })
            );
        }
    }
}
