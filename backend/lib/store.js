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
exports.setUserTokens = exports.makeUserStoreId = exports.connect = void 0;
const redis_1 = require("redis");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const secrets = require("../configs/secrets.json");
const configs = require("../configs/configs.json");
const client = (0, redis_1.createClient)();
client.on("error", (err) => console.log("Redis Client Error", err));
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
    });
}
exports.connect = connect;
function makeUserStoreId(username, token_type, user_ip) {
    return `${username}_${token_type}_${user_ip}`.toString();
}
exports.makeUserStoreId = makeUserStoreId;
function setUserTokens(username, token_type, user_ip) {
    return new Promise((success, error) => __awaiter(this, void 0, void 0, function* () {
        validateTokenType(token_type);
        let secret;
        if (token_type == "refresh")
            secret = secrets.refresh_token;
        if (token_type == "auth")
            secret = secrets.auth_token;
        var final_token;
        if (token_type == "refresh") {
            final_token = yield jsonwebtoken_1.default.sign({ username: username }, secret, { algorithm: "HS256" });
        }
        if (token_type == "auth") {
            final_token = yield crypto_1.default.randomBytes(configs.api.tokens.auth_token.length).toString("hex");
        }
        if (!final_token) {
            return error();
        }
        let token_expire;
        if (token_type == "refresh")
            token_expire = configs.api.tokens.refresh_token.expire;
        else if (token_type == "auth")
            token_expire = configs.api.tokens.auth_token.expire;
        else
            return error();
        let user_id = makeUserStoreId(username, token_type, user_ip);
        if (final_token) {
            yield client.set(user_id, final_token);
            yield client.expire(user_id, token_expire);
            success(final_token);
        }
        else {
            error();
        }
    }));
}
exports.setUserTokens = setUserTokens;
function validateTokenType(token_type) {
    if (!["refresh", "auth"].includes(token_type)) {
        throw "Invalid token type!";
    }
}
exports.default = client;
