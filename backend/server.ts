const configs = require("./configs/configs.json");
const secrets = require("./configs/secrets.json");
import express, { Request, Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as database from "./lib/database";
const fileUpload = require("express-fileupload");
import { initSocket } from "./socket/socket";
const app: Express = express();
require("express-ws")(app);
import session from "express-session";
const randomToken = require("random-token");

app.set("base", "/api");
app.enable("trust proxy");
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    fileUpload({
        createParentPath: true,
    })
);
app.use(
    session({
        name: "auth_token",
        secret: secrets.SESSION_SECRET,
        cookie: { maxAge: 60000 },
        resave: true,
        saveUninitialized: true,
    })
);

// FIXME - Security bug fix on serving files
app.use("/api/uploads/profile_photos/:filename", (req, res) => {
    res.type("image/png");
    res.sendFile(`${process.cwd()}/uploads/profile_photos/${req.params.filename}`);
});

app.use("/api/uploads/photo_messages/:filename", (req, res) => {
    res.type("image/png");
    res.sendFile(`${process.cwd()}/uploads/photo_messages/${req.params.filename}`);
});

// Importing Routers
import UsersRoutes from "./routes/users.routes";
import ProfilePhotosRoutes from "./routes/profile_photos.routes";
import MessagesRoutes from "./routes/messages.routes";
import ChatsRoutes from "./routes/chats.routes";

app.use("/api/users", UsersRoutes);
app.use("/api/profile_photos", ProfilePhotosRoutes);
app.use("/api/messages", MessagesRoutes);
app.use("/api/chats", ChatsRoutes);

app.listen(configs.http_port, "0.0.0.0", () => {
    console.clear();

    console.log(`Api listening on port ${configs.http_port}!`);

    initSocket(app);

    database.connect();
});
