import { ISocketClient } from "../lib/interfaces";
import MessagesSocket from "./sockets/messages.socket";
import OnlineStateSocket from "./sockets/online_state.socket";

export let users: Array<ISocketClient> = [];
export let rooms: any = {};

import RootSocket from "./sockets/root.socket";

export function initSocket(app: any) {
    RootSocket(app);
    OnlineStateSocket(app);
    MessagesSocket(app);
}
