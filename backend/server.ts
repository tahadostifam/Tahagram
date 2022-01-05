const configs = require("./configs/configs.json");
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as database from "./lib/database";
const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Importing Routers
import UsersRoutes from "./routes/users.routes";
app.use("/users", UsersRoutes);

app.listen(configs.api.port, () => {
    console.clear();

    console.log(`Server hash listening on port ${configs.api.port}!`);

    database.connect();
});
