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
const client_ip_1 = require("../lib/client_ip");
const status_codes_1 = __importDefault(require("../lib/status_codes"));
const store_1 = __importStar(require("../lib/store"));
const user_1 = __importDefault(require("../models/user"));
function default_1(req, res, next) {
    var _a;
    const client_ip = (_a = (0, client_ip_1.clientIp)(req, res)) === null || _a === void 0 ? void 0 : _a.toString();
    if (client_ip) {
        if (req.headers.username && req.headers.auth_token) {
            const username = String(req.headers.username);
            const auth_token = String(req.headers.auth_token);
            if (username && auth_token) {
                const user_id_in_store = (0, store_1.makeUserStoreId)(username, "auth", (0, client_ip_1.cleanIpDots)(client_ip));
                store_1.default.get(user_id_in_store).then((token_in_store) => __awaiter(this, void 0, void 0, function* () {
                    if (String(token_in_store).trim() == String(auth_token).trim()) {
                        // success | requested token is valid
                        const user = yield user_1.default.findOne({
                            username: req.headers.username,
                        });
                        if (!user)
                            return status_codes_1.default.invalid_token(req, res, next);
                        req.username = username;
                        req.user_info = user;
                        next();
                    }
                    else {
                        status_codes_1.default.invalid_token(req, res, next);
                    }
                }));
            }
        }
        else {
            res.statusCode = 400;
            return res.send({
                message: "username or auth_token not found in request header",
            });
        }
    }
}
exports.default = default_1;
