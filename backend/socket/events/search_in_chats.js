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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../../models/user"));
const chats_1 = __importDefault(require("../../models/chats"));
function search_in_chats(ws, parsedData) {
    return __awaiter(this, void 0, void 0, function* () {
        if (parsedData.input && parsedData.input.trim() != "") {
            // SECTION - in this section we gonna search in users_collection
            // we do it because probably user wants to dm to a user
            let finded_users = yield user_1.default.find({
                $or: [{ username: { $regex: ".*" + parsedData.input + ".*" } }, { full_name: { $regex: ".*" + parsedData.input + ".*" } }],
            }, {
                password_digest: 0,
                __v: 0,
                chats: 0,
                bio: 0,
            });
            finded_users = JSON.parse(JSON.stringify(finded_users));
            if (finded_users) {
                finded_users.forEach((item, index) => {
                    if (item.profile_photos && item.profile_photos.length > 0) {
                        finded_users[index]["profile_photo"] = item.profile_photos.reverse()[0];
                        delete finded_users[index]["profile_photos"];
                    }
                    if (item && item.username == ws.user.username) {
                        finded_users.splice(index);
                    }
                    if (finded_users[index]) {
                        finded_users[index]["chat_type"] = "private";
                        finded_users[index]["username"] = item.username;
                    }
                });
            }
            else {
                finded_users = [];
            }
            // SECTION - searching in channels&groups section
            let channels_and_groups = yield chats_1.default.find({
                $and: [
                    { $or: [{ chat_type: "channel" }, { chat_type: "group" }] },
                    { $or: [{ username: { $regex: ".*" + parsedData.input + ".*" } }, { full_name: { $regex: ".*" + parsedData.input + ".*" } }] },
                ],
            }, {
                __v: 0,
                bio: 0,
                messages_list: 0,
            });
            channels_and_groups = JSON.parse(JSON.stringify(channels_and_groups));
            if (!channels_and_groups) {
                channels_and_groups = [];
            }
            channels_and_groups.forEach((item, index) => __awaiter(this, void 0, void 0, function* () {
                if (item.admins) {
                    const iam_admin_of_chat = item.admins.includes(ws.user.username);
                    const iam_creator_of_chat = item.creator_username == ws.user.username;
                    channels_and_groups[index]["iam_admin_of_chat"] = iam_admin_of_chat || iam_creator_of_chat;
                }
                if (item["iam_admin_of_chat"] != true && item.members) {
                    const iam_amember_of_chat = item.members.includes(ws.user.username);
                    channels_and_groups[index]["iam_amember_of_chat"] = iam_amember_of_chat;
                }
                if (item.profile_photos && item.profile_photos.length > 0) {
                    channels_and_groups[index]["profile_photo"] = item.profile_photos.reverse()[0];
                }
                delete channels_and_groups[index]["members"];
                delete channels_and_groups[index]["admins"];
                delete channels_and_groups[index]["profile_photos"];
            }));
            const data_to_send = finded_users.concat(channels_and_groups);
            ws.send(JSON.stringify({
                event: "search_in_chats",
                data: data_to_send,
            }));
        }
    });
}
exports.default = search_in_chats;
