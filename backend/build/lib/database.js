"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const configs = require("../configs/configs.json");
const mongoose = require("mongoose");
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        let connection_string = `mongodb://`;
        if (configs["mongo"]["user"] && configs["mongo"]["pass"]) {
            connection_string += `${configs["mongo"]["user"]}:${configs["mongo"]["pass"]}@`;
        }
        connection_string += `${configs["mongo"]["host"]}:${configs["mongo"]["port"]}/${configs["mongo"]["db"]}`;
        const mongodb_configs = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        yield mongoose
            .connect(connection_string, mongodb_configs)
            .then(() => console.log("Successfully connected to MongoDB!"))
            .catch((err) => console.log(err));
    });
}
exports.connect = connect;
