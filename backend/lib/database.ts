const configs = require("../configs/configs.json");
import mongoose from "mongoose";

export async function connect() {
    await mongoose.connect(`mongodb://${configs["mongo"]["host"]}:${configs["mongo"]["port"]}/${configs["mongo"]["db"]}`);
}
