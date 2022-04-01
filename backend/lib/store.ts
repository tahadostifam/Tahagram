import { createClient } from "redis";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const secrets = require("../configs/secrets.json");
const configs = require("../configs/configs.json");

const client = createClient({
});

client.on("error", (err) => console.log("Redis Client Error", err));

export async function connect() {
    await client.connect();
}

export function makeUserStoreId(username: string, token_type: string, user_ip: string) {
    return `${username}_${token_type}_${user_ip}`.toString();
}

export function setUserTokens(username: string, token_type: string, user_ip: string) {
    return new Promise(async (success, error) => {
        validateTokenType(token_type);

        let secret;
        if (token_type == "refresh") secret = secrets.refresh_token;
        if (token_type == "auth") secret = secrets.auth_token;

        var final_token;
        if (token_type == "refresh") {
            final_token = await jwt.sign({ username: username }, secret, { algorithm: "HS256" });
        }
        if (token_type == "auth") {
            final_token = await crypto.randomBytes(configs.api.tokens.auth_token.length).toString("hex");
        }

        if (!final_token) {
            return error();
        }

        let token_expire: number;
        if (token_type == "refresh") token_expire = configs.api.tokens.refresh_token.expire;
        else if (token_type == "auth") token_expire = configs.api.tokens.auth_token.expire;
        else return error();

        let user_id = makeUserStoreId(username, token_type, user_ip);

        if (final_token) {
            await client.set(user_id, final_token);
            await client.expire(user_id, token_expire);

            success(final_token);
        } else {
            error();
        }
    });
}

function validateTokenType(token_type: string) {
    if (!["refresh", "auth"].includes(token_type)) {
        throw "Invalid token type!";
    }
}

export default client;
