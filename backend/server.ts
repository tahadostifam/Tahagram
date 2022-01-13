const configs = require("./configs/configs.json");
import express, { Request, Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import initSocket from "./socket/socket";
import * as database from "./lib/database";
import * as store from "./lib/store";
const fileUpload = require("express-fileupload");
const app: Express = express();

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

app.use("/uploads/profile_photos/:filename", (req, res) => {
    res.type("png");
    res.sendFile(`${process.cwd()}/uploads/profile_photos/${req.params.filename}`);
});

// Importing Routers
import UsersRoutes from "./routes/users.routes";
import ProfilePhotosRoutes from "./routes/profile_photos.routes";

app.use("/api/users", UsersRoutes);
app.use("/api/profile_photos", ProfilePhotosRoutes);

app.listen(configs.api.port, () => {
    console.clear();

    console.log(`Api-Server has listening on port ${configs.api.port}!`);
    initSocket();

    database.connect();
    store.connect();
});
