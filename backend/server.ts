const configs = require("./configs/configs.json");
import express, { Request } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import initSocket from "./socket/socket";
import * as database from "./lib/database";
import * as store from "./lib/store";
const app: any = express();

app.set("base", "/api");
app.enable("trust proxy");
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Socket Init

// Importing Routers
import UsersRoutes from "./routes/users.routes";

app.use("/api/users", UsersRoutes);

app.listen(configs.api.port, () => {
    console.clear();

    console.log(`Api-Server has listening on port ${configs.api.port}!`);
    initSocket();

    database.connect();
    store.connect();
});
