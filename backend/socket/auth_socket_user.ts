import store, { makeUserStoreId } from "../lib/store";
import { cleanIpDots } from "../lib/client_ip";
import * as database from "../lib/database";

import User from "../models/user";
import { IMiddleWareRequest } from "../lib/interfaces";

export function clearParams(url: string) {
    const params = url.substring(url.indexOf("?username"));
    return url.replace(params, "").trim();
}

export function getCookie(cookies: string, cookie_name: string | undefined) {
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

export function clientIp(req: IMiddleWareRequest | undefined) {
    if (!req) return null;
    let client_ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    if (client_ip) {
        client_ip = client_ip.replace(/^.*:/, "");
        return client_ip;
    } else {
        return null;
    }
}

export function authenticate_socket_user(username: string, client_ip: string, auth_token: string) {
    return new Promise((success, error) => {
        const user_id_in_store = makeUserStoreId(username, "auth", client_ip);
        store.get(user_id_in_store).then(async (token_in_store) => {
            if (String(token_in_store).trim() == String(auth_token).trim()) {
                // success | requested token is valid
                const user = await User.findOne({
                    username: username,
                });
                if (!user) return error();
                success(user);
            } else {
                return error();
            }
        });
    });
}
