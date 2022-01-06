const configs = require("../configs/configs.json");
import { Client } from "pg";

const client = new Client({
    host: configs.postgres.host,
    port: configs.postgres.port,
    user: configs.postgres.user,
    password: configs.postgres.pass,
    database: configs.postgres.db,
});

export async function connect() {
    await client.connect();
}

export async function disconnect() {
    await client.end();
}

export async function exec_query(query_string: string, values: Array<string>) {
    return new Promise(async (success, error) => {
        client.query(query_string, values, async (err, res) => {
            if (err) return error();
            success(res.rows);
        });
    });
}
