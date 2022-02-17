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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs = require("./configs/configs.json");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const socket_1 = __importDefault(require("./socket/socket"));
const database = __importStar(require("./lib/database"));
const store = __importStar(require("./lib/store"));
const fileUpload = require("express-fileupload");
const app = (0, express_1.default)();
app.set("base", "/api");
app.enable("trust proxy");
app.use((0, cors_1.default)({ origin: "*" }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(fileUpload({
    createParentPath: true,
}));
app.use("/uploads/profile_photos/:filename", (req, res) => {
    res.type("png");
    res.sendFile(`${process.cwd()}/uploads/profile_photos/${req.params.filename}`);
});
app.use("/uploads/photo_messages/:filename", (req, res) => {
    res.type("png");
    res.sendFile(`${process.cwd()}/uploads/photo_messages/${req.params.filename}`);
});
// Importing Routers
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const profile_photos_routes_1 = __importDefault(require("./routes/profile_photos.routes"));
const messages_routes_1 = __importDefault(require("./routes/messages.routes"));
const chats_routes_1 = __importDefault(require("./routes/chats.routes"));
app.use("/api/users", users_routes_1.default);
app.use("/api/profile_photos", profile_photos_routes_1.default);
app.use("/api/messages", messages_routes_1.default);
app.use("/api/chats", chats_routes_1.default);
app.listen(configs.api.port, "0.0.0.0", () => {
    console.clear();
    console.log(`Api-Server has listening on port ${configs.api.port}!`);
    (0, socket_1.default)();
    database.connect();
    store.connect();
});
