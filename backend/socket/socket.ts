const configs = require("../configs/configs.json");
import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { cleanIpDots } from "../lib/client_ip";
import { clearParams, authenticate_socket_user, getCookie, clientIp } from "./auth_socket_user";
// import { setUserUUID } from "./room_manager";
const server_port = configs["socket"]["port"];

// import { parse as parseUrl } from "url";

const users: Array<object> = [];

export default async function handleSocket() {
    const server = createServer();
    const wss = new WebSocketServer({ noServer: true });

    server.on("upgrade", (request, socket, head) => {
        let client_ip = clientIp(request);
        if (client_ip) client_ip = cleanIpDots(client_ip);

        function destroySocket() {
            socket.write("401 Unauthorized");
            socket.destroy();
            return;
        }

        if (request.headers.cookie && client_ip) {
            const username = getCookie(request.headers.cookie, "username");
            const auth_token = getCookie(request.headers.cookie, "auth_token");

            if (username && auth_token) {
                authenticate_socket_user(username, client_ip, auth_token).then(
                    (user) => {
                        console.log("+ A Client Connected Successfully");
                        return wss.handleUpgrade(request, socket, head, async (ws) => {
                            // await setUserUUID(ws);
                            handleSocketUserOnConnected(ws, username);
                            ws.on("close", () => handleSocketUserOnDisConnected(ws, username));
                            // After Connectes
                            ws.on("message", (data) => handleSocketMessages(data, ws));
                        });
                    },
                    () => {
                        return destroySocket();
                    }
                );
            } else {
                return destroySocket();
            }
        } else {
            return destroySocket();
        }
    });

    await server.listen(server_port);
    console.log(`Socket-Server has listening on port ${server_port}`);
}

function handleSocketUserOnConnected(ws: any, username: string) {
    if (!users.find((item: any) => item.username == username)) {
        users.push({
            username: username,
            ws: ws,
        });
    }

    ws.send("successfully connected to socket");
}

function handleSocketUserOnDisConnected(ws: WebSocket, username: string) {
    const user_index = users
        .map((e: any) => {
            return e.username;
        })
        .indexOf(username);
    if (user_index > -1) {
        users.splice(user_index, 1);
    }

    console.log("user disconnected");
}

function handleSocketMessages(data: any, ws: WebSocket) {
    try {
        const parsedData = JSON.parse(data.toString("utf8"));
        console.log(parsedData);
        ws.send("message sended");
    } catch {
        ws.send("error in parsing data");
    }
}
