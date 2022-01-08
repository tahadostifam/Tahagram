const configs = require("../configs/configs.json");
import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { parse as parseUrl } from "url";
import { cleanIpDots } from "../lib/client_ip";
const server_port = configs["socket"]["port"];
import store, { makeUserStoreId } from "../lib/store";
import * as database from "../lib/database";
import { Request } from "express";

function clearParams(url: string) {
    const params = url.substring(url.indexOf("?username"));
    return url.replace(params, "").trim();
}

function getCookie(cookies: string, cookie_name: string | undefined) {
    if (!cookie_name) return null;
    let name = cookie_name + "=";
    let decodedCookie = decodeURIComponent(cookies);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

function clientIp(req: any | undefined) {
    if (!req) return null;
    let client_ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    if (client_ip) {
        client_ip = client_ip.replace(/^.*:/, "");
        return client_ip;
    } else {
        return null;
    }
}

function authenticate_socket_user(username: string, client_ip: string, auth_token: string) {
    return new Promise((success, error) => {
        const user_id_in_store = makeUserStoreId(username, "auth", client_ip);
        store.get(user_id_in_store).then(async (token_in_store) => {
            if (String(token_in_store).trim() == String(auth_token).trim()) {
                // success | requested token is valid
                database.exec_query("SELECT full_name, username, bio, last_seen from tbl_users WHERE username=$1", [username]).then(
                    (result: any) => {
                        if (result.length == 0) return error();
                        else {
                            // NOTE -> auth_token is valid
                            success(result[0]);
                        }
                    },
                    () => error()
                );
            } else {
                return error();
            }
        });
    });
}

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
                        return wss.handleUpgrade(request, socket, head, (ws) => {
                            ws.send("successfully connected to socket");
                            ws.on("message", (data) => {
                                handleSocketConnection(data, ws);
                            });
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

function handleSocketConnection(data: any, ws: WebSocket) {
    try {
        const parsedData = JSON.parse(data.toString("utf8"));
        console.log(parsedData);
        ws.send("message sended");
    } catch {
        ws.send("error in parsing data");
    }
}
