import { WebSocket } from "ws";
import User from "../../models/user";

export async function update_full_name(ws: any, parsedData: any) {
    if (parsedData.full_name && parsedData.full_name.trim() != "") {
        const update = await User.findOneAndUpdate(ws.user.username, {
            full_name: parsedData.full_name,
        });
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
