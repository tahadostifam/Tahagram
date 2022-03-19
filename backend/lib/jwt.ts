import jwt from "jsonwebtoken";
const configs = require("../configs/configs.json");

export function generateToken(_username_: string) {
    return new Promise((resolve, reject) => {
        try {
            const token = jwt.sign({ username: _username_ }, configs.api.jwt_secret, { algorithm: "HS256", expiresIn: configs.api.jwt_expire });
            resolve(token);
        } catch (err) {
            reject(err);
        }
    });
}

export function compareToken(token: string) {
    return new Promise((resolve, reject) => {
        try {
            const result = jwt.verify(token, configs.api.jwt_secret);
            if (result) {
                resolve(result);
            } else {
                reject();
            }
        } catch (err) {
            reject(err);
        }
    });
}

export function removeBearerKeyword(token: string): string {
    return token.replace("Bearer ", "");
}
