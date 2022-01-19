import { WebSocket } from "ws";
import User from "../../models/user";

export default async function search_in_chats(ws: any, parsedData: any) {
    if (parsedData.input && parsedData.input.trim() != "") {
        const finded_users = await User.find(
            {
                $or: [{ username: { $regex: ".*" + parsedData.input + ".*" } }, { full_name: { $regex: ".*" + parsedData.input + ".*" } }],
            },
            {
                password_digest: 0,
                __v: 0,
                _id: 0,
                chats: 0,
            }
        );

        if (finded_users) {
            finded_users.forEach((item, index) => {
                if (item && item.username == ws.user.username) {
                    finded_users.splice(index);
                }
            });

            ws.send(
                JSON.stringify({
                    event: "search_in_chats",
                    data: finded_users,
                })
            );
        }
    }
}
