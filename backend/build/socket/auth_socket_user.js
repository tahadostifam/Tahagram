"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.authenticate_socket_user = exports.clientIp = exports.getCookie = exports.clearParams = void 0;
const store_1 = __importStar(require("../lib/store"));
const user_1 = __importDefault(require("../models/user"));
function clearParams(url) {
    const params = url.substring(url.indexOf("?username"));
    return url.replace(params, "").trim();
}
exports.clearParams = clearParams;
function getCookie(cookies, cookie_name) {
    if (!cookie_name)
        return null;
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
exports.getCookie = getCookie;
function clientIp(req) {
    if (!req)
        return null;
    let client_ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    if (client_ip) {
        client_ip = client_ip.replace(/^.*:/, "");
        return client_ip;
    }
    else {
        return null;
    }
}
exports.clientIp = clientIp;
function authenticate_socket_user(username, client_ip, auth_token) {
    return new Promise((success, error) => {
        const user_id_in_store = (0, store_1.makeUserStoreId)(username, "auth", client_ip);
        store_1.default.get(user_id_in_store).then((token_in_store) => __awaiter(this, void 0, void 0, function* () {
            if (String(token_in_store).trim() == String(auth_token).trim()) {
                // success | requested token is valid
                const user = yield user_1.default.findOne({
                    username: username,
                });
                if (!user)
                    return error();
                success(user);
            }
            else {
                return error();
            }
        }));
    });
}
exports.authenticate_socket_user = authenticate_socket_user;
