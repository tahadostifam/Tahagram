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
const database_1 = require("../lib/database");
console.clear();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, database_1.connect)();
        // SECTION Making a private chat
        // const chat = new Chats({
        //     chat_type: "private",
        //     messages_list: [
        //         {
        //             sender_username: "maximilian",
        //             message_type: "text",
        //             send_time: Date.now(),
        //             content: "Hey Guys!",
        //             edited: false,
        //         },
        //     ],
        //     sides: {
        //         user_1: "maximilian",
        //         user_2: "luffy",
        //     },
        // });
        // await chat.save();
        // console.log("A private chat created.");
        // SECTION - add chat into user chats_list
        // const user = await User.findOneAndUpdate(
        //     {
        //         username: "maximilian",
        //     },
        //     {
        //         $push: {
        //             chats: {
        //                 chat_id: "61f1b757ac7ebac12eb5081c", // the id of chat [chats collection]
        //             },
        //         },
        //     }
        // );
    });
}
main();
