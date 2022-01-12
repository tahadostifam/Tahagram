const configs = require("../configs/configs.json");
const mongoose = require("mongoose");

export async function connect() {
    let connection_string = `mongodb://`;
    if (configs["mongo"]["user"] && configs["mongo"]["pass"]) {
        connection_string += `${configs["mongo"]["user"]}:${configs["mongo"]["pass"]}@`;
    }
    connection_string += `${configs["mongo"]["host"]}:${configs["mongo"]["port"]}/${configs["mongo"]["db"]}`;

    const mongodb_configs: any = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    await mongoose
        .connect(connection_string, mongodb_configs)
        .then(() => console.log("Successfully connected to MongoDB!"))
        .catch((err: any) => console.log(err));
}
