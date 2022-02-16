const configs = require("../configs/configs.json");
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { cleanIpDots } from "../lib/client_ip";
import { clearParams, authenticate_socket_user, getCookie, clientIp } from "./auth_socket_user";
import { setUserUUID } from "./room_manager";
const server_port = configs["socket"]["port"];
import { ISocketClient, IUser, IWebSocket } from "../lib/interfaces";
import User from "../models/user";

export let users: Array<ISocketClient> = [];

import events from "./events/events";

export default async function handleSocket() {
    const server = createServer();
    const wss = new WebSocketServer({ noServer: true, host: "0.0.0.0" });

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
                        console.log(`+ ${username} Connected To Socket`);
                        return wss.handleUpgrade(request, socket, head, async (ws: any) => {
                            ws.user = user;
                            await setUserUUID(ws);
                            handleSocketUserOnConnected(ws);
                            ws.on("close", () => handleSocketUserOnDisConnected(ws));
                            // After Connectes
                            ws.on("message", (data: any) => handleSocketMessages(data, ws));
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

function handleSocketUserOnConnected(ws: IWebSocket) {
    if (!users.find((item: any) => item.uuid == ws.uuid)) {
        users.push({
            uuid: ws.uuid,
            username: ws.user.username,
            ws: ws,
        });

        userIsOnline(ws.user.username);
    }

    ws.send(
        JSON.stringify({
            message: "successfully connected to socket",
        })
    );
}

function handleSocketUserOnDisConnected(ws: IWebSocket) {
    users = users.filter((value, index, arr) => {
        return value.username !== ws.user.username;
    });

    userIsOffline(ws.user.username);

    console.log(`- ${ws.user.username} Disconnected From Socket`);
}

function handleSocketMessages(data: any, ws: IWebSocket) {
    try {
        const parsedData: any = JSON.parse(data.toString("utf8"));
        switch (parsedData.event) {
            case "search_in_chats":
                events.search_in_chats(ws, parsedData);
                break;
            case "update_full_name":
                events.update_full_name(ws, parsedData);
                break;
            case "update_bio":
                events.update_bio(ws, parsedData);
                break;
            case "send_text_message":
                events.send_text_message(ws, parsedData);
                break;
            case "delete_message":
                events.delete_message(ws, parsedData);
                break;
            case "seen_message":
                events.user_seened_message(ws, parsedData);
                break;
            case "get_chat_full_info":
                events.get_chat_full_info(ws, parsedData);
                break;
            case "check_username_existly":
                events.check_username_existly(ws, parsedData);
                break;
            case "get_chat_messages":
                events.get_chat_messages(ws, parsedData);
                break;
            case "join_to_chat":
                events.join_to_chat(ws, parsedData);
                break;
            case "get_last_seen":
                events.get_last_seen(ws, parsedData);
                break;
            case "delete_chat":
                events.delete_chat(ws, parsedData);
                break;
            case "change_member_access":
                events.change_member_access(ws, parsedData);
                break;
            default:
                ws.send(JSON.stringify({ message: "command not found" }));
                break;
        }
    } catch {
        ws.send("error in parsing data");
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
