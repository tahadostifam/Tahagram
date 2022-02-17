"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const configs = require("../configs/configs.json");
const http_1 = require("http");
const ws_1 = require("ws");
const client_ip_1 = require("../lib/client_ip");
const auth_socket_user_1 = require("./auth_socket_user");
const room_manager_1 = require("./room_manager");
const server_port = configs["socket"]["port"];
const user_1 = __importDefault(require("../models/user"));
exports.users = [];
const events_1 = __importDefault(require("./events/events"));
function handleSocket() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = (0, http_1.createServer)();
        const wss = new ws_1.WebSocketServer({ noServer: true, host: "0.0.0.0" });
        server.on("upgrade", (request, socket, head) => {
            let client_ip = (0, auth_socket_user_1.clientIp)(request);
            if (client_ip)
                client_ip = (0, client_ip_1.cleanIpDots)(client_ip);
            function destroySocket() {
                socket.write("401 Unauthorized");
                socket.destroy();
                return;
            }
            if (request.headers.cookie && client_ip) {
                const username = (0, auth_socket_user_1.getCookie)(request.headers.cookie, "username");
                const auth_token = (0, auth_socket_user_1.getCookie)(request.headers.cookie, "auth_token");
                if (username && auth_token) {
                    (0, auth_socket_user_1.authenticate_socket_user)(username, client_ip, auth_token).then((user) => {
                        console.log(`+ ${username} Connected To Socket`);
                        return wss.handleUpgrade(request, socket, head, (ws) => __awaiter(this, void 0, void 0, function* () {
                            ws.user = user;
                            yield (0, room_manager_1.setUserUUID)(ws);
                            handleSocketUserOnConnected(ws);
                            ws.on("close", () => handleSocketUserOnDisConnected(ws));
                            // After Connectes
                            ws.on("message", (data) => handleSocketMessages(data, ws));
                        }));
                    }, () => {
                        return destroySocket();
                    });
                }
                else {
                    return destroySocket();
                }
            }
            else {
                return destroySocket();
            }
        });
        yield server.listen(server_port);
        console.log(`Socket-Server has listening on port ${server_port}`);
    });
}
exports.default = handleSocket;
function handleSocketUserOnConnected(ws) {
    if (!exports.users.find((item) => item.uuid == ws.uuid)) {
        exports.users.push({
            uuid: ws.uuid,
            username: ws.user.username,
            ws: ws,
        });
        userIsOnline(ws.user.username);
    }
    ws.send(JSON.stringify({
        message: "successfully connected to socket",
    }));
}
function handleSocketUserOnDisConnected(ws) {
    exports.users = exports.users.filter((value, index, arr) => {
        return value.username !== ws.user.username;
    });
    userIsOffline(ws.user.username);
    console.log(`- ${ws.user.username} Disconnected From Socket`);
}
function handleSocketMessages(data, ws) {
    try {
        const parsedData = JSON.parse(data.toString("utf8"));
        switch (parsedData.event) {
            case "search_in_chats":
                events_1.default.search_in_chats(ws, parsedData);
                break;
            case "update_full_name":
                events_1.default.update_full_name(ws, parsedData);
                break;
            case "update_bio":
                events_1.default.update_bio(ws, parsedData);
                break;
            case "send_text_message":
                events_1.default.send_text_message(ws, parsedData);
                break;
            case "delete_message":
                events_1.default.delete_message(ws, parsedData);
                break;
            case "seen_message":
                events_1.default.user_seened_message(ws, parsedData);
                break;
            case "get_chat_full_info":
                events_1.default.get_chat_full_info(ws, parsedData);
                break;
            case "check_username_existly":
                events_1.default.check_username_existly(ws, parsedData);
                break;
            case "get_chat_messages":
                events_1.default.get_chat_messages(ws, parsedData);
                break;
            case "join_to_chat":
                events_1.default.join_to_chat(ws, parsedData);
                break;
            case "get_last_seen":
                events_1.default.get_last_seen(ws, parsedData);
                break;
            case "delete_chat":
                events_1.default.delete_chat(ws, parsedData);
                break;
            case "change_member_access":
                events_1.default.change_member_access(ws, parsedData);
                break;
            default:
                ws.send(JSON.stringify({ message: "command not found" }));
                break;
        }
    }
    catch (_a) {
        ws.send("error in parsing data");
    }
}
function userIsOnline(username) {
    return __awaiter(this, void 0, void 0, function* () {
        yield user_1.default.findOneAndUpdate({
            username: username,
        }, {
            last_seen: "online",
        });
    });
}
function userIsOffline(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const last_online_time = Date.now();
        yield user_1.default.findOneAndUpdate({
            username: username,
        }, {
            last_seen: last_online_time,
        });
    });
}
