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
exports.user_seened_message = exports.change_member_access = exports.delete_chat = exports.getUserFullInfo = exports.delete_message = exports.get_chat_messages = exports.join_to_chat = exports.handle_messages_socket = exports.send_text_message = exports.broadCastToAllMembers = exports.pushChatToUserChatsList = exports.check_username_existly = void 0;
const user_3 = __importDefault(require("../../models/user"));
const chats_1 = __importDefault(require("../../models/chats"));
const room_manager_1 = require("../room_manager");
const socket_1 = require("../socket");
const mongodb_1 = require("mongodb");
const users_1 = require("./users");
const messages_controller_1 = require("../../controllers/messages_controller");
const fs_1 = __importDefault(require("fs"));
function check_username_existly(ws, parsedData) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = parsedData.username;
        if (username && username.length > 0) {
            const chat = yield chats_1.default.findOne({
                username: username,
            });
            const user = yield user_3.default.findOne({
                username: username,
            });
            if (chat || user) {
                ws.send(JSON.stringify({
                    message: "chat exists",
                    username: username,
                }));
            }
            else {
                ws.send(JSON.stringify({
                    message: "chat not exists",
                    username: username,
                }));
            }
        }
    });
}
exports.check_username_existly = check_username_existly;
function pushChatToUserChatsList(username, chat_id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield user_3.default.updateOne({
            username: username,
        }, {
            $push: {
                chats: {
                    chat_id: chat_id, // the id of chat [chats collection]
                },
            },
        });
    });
}
exports.pushChatToUserChatsList = pushChatToUserChatsList;
function broadCastToAllMembers(members, data_to_send, username) {
    return __awaiter(this, void 0, void 0, function* () {
        yield members.forEach((member_username, member_index) => __awaiter(this, void 0, void 0, function* () {
            if (member_username != username) {
                const member_ws = yield socket_1.users.find(({ username }) => username === member_username);
                if (member_ws) {
                    // if user was online
                    member_ws.ws.send(JSON.stringify(data_to_send));
                }
            }
        }));
    });
}
exports.broadCastToAllMembers = broadCastToAllMembers;
function send_text_message(ws, parsedData) {
    return __awaiter(this, void 0, void 0, function* () {
        const chat_id = parsedData.chat_id;
        const chat_type = parsedData.chat_type;
        const message_text = parsedData.send_text_message_input;
        const target_username = parsedData.target_username;
        if (message_text && message_text.trim() != "" && chat_id && chat_id.trim() != "" && chat_type && chat_type.length > 0) {
            const message = {
                message_id: "",
                sender_username: ws.user.username,
                message_type: "text",
                send_time: Date.now(),
                content: message_text,
                edited: false,
            };
            if (chat_type == "private") {
                message.seen_state = "sended";
            }
            handle_messages_socket(chat_id, chat_type, target_username, ws, message);
        }
    });
}
exports.send_text_message = send_text_message;
function handle_messages_socket(chat_id, chat_type, target_username, ws, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const message_id = new mongodb_1.ObjectId().toString();
        message.message_id = message_id;
        function pushMessage(message, response) {
            return __awaiter(this, void 0, void 0, function* () {
                yield chats_1.default.findOneAndUpdate({ _id: chat_id }, {
                    $push: {
                        messages_list: message,
                    },
                });
                ws.send(JSON.stringify(response));
            });
        }
        if (chat_type == "private") {
            if (target_username && target_username.length > 0 && target_username != ws.user.username) {
                var target_ws;
                let chat = yield chats_1.default.findOne({
                    $or: [{ sides: { user_1: ws.user.username, user_2: target_username } }, { sides: { user_1: target_username, user_2: ws.user.username } }],
                });
                function setTargetWs() {
                    target_ws = socket_1.users.find(({ username: _username_ }) => _username_ === target_username);
                }
                if (chat) {
                    yield setTargetWs();
                    if (!target_ws || String(target_ws).trim() == "") {
                        target_ws = undefined;
                        console.log("E :: target_ws not found");
                    }
                }
                if (chat) {
                    const room = room_manager_1.rooms[chat_id];
                    if (room) {
                        if (target_ws) {
                            broadCastToOtherSide(target_ws, chat.chat_type, false);
                        }
                        else {
                            console.error("B :: target_ws not found");
                        }
                    }
                    else {
                        if (chat._id && target_username) {
                            (0, room_manager_1.createPrivateRoom)(chat._id, ws.user.username, target_username).then((room) => {
                                if (target_ws) {
                                    broadCastToOtherSide(target_ws, chat.chat_type, true);
                                }
                                else {
                                    console.error("C :: target_ws not found");
                                }
                            });
                        }
                        else {
                            console.error("chat._id or target_username or target_ws is empty");
                        }
                    }
                    pushMessage(message, {
                        event: "send_text_message",
                        chat_id: chat_id,
                        message: "message sended",
                        message_callback: message,
                    });
                }
                else {
                    yield setTargetWs();
                    // we must create a new private_chat
                    const user = yield user_3.default.findOne({
                        username: target_username,
                    });
                    if (user) {
                        var new_chat = new chats_1.default({
                            chat_type: "private",
                            messages_list: message,
                            sides: {
                                user_1: ws.user.username,
                                user_2: target_username,
                            },
                        });
                        yield new_chat.save();
                        // Add this chat into user_1 and user_2 chats_list
                        pushChatToUserChatsList(ws.user.username, new_chat._id);
                        pushChatToUserChatsList(target_username, new_chat._id);
                        // to the sender
                        pushMessage(message, {
                            chat_created: {
                                chat_id: new_chat._id,
                                sides: {
                                    user_1: ws.user.username,
                                    user_2: target_username,
                                },
                            },
                            event: "send_text_message",
                            chat_id: new_chat._id,
                            message: "message sended",
                            message_callback: message,
                            chat_type: "private",
                            target_username: target_username,
                        });
                        // to the receiver
                        (0, room_manager_1.createPrivateRoom)(new_chat._id, ws.user.username, target_username).then(() => {
                            if (target_ws) {
                                let data_to_send = {
                                    __chat_created: {
                                        chat_id: new_chat._id,
                                        sides: {
                                            user_1: ws.user.username,
                                            user_2: target_username,
                                        },
                                        messages: [message],
                                        full_name: ws.user.full_name,
                                        username: ws.user.username,
                                    },
                                    event: "chat_created_from_a_user",
                                    chat_id: new_chat._id,
                                    chat_type: "private",
                                };
                                if (user.profile_photos.length > 0) {
                                    data_to_send["profile_photo"] = user.profile_photos[0];
                                }
                                target_ws.ws.send(JSON.stringify(data_to_send));
                            }
                            else {
                                console.log("D :: target_ws not found");
                            }
                        });
                    }
                }
                function broadCastToOtherSide(target_ws, chat_type, chat_created) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (target_ws) {
                            const new_chat = {
                                username: target_ws.ws.user.username,
                                full_name: target_ws.ws.user.full_name,
                                sides: {
                                    user_1: ws.user.username,
                                    user_2: target_ws.ws.user.username,
                                },
                                target_username: target_username,
                            };
                            if (ws.user.profile_photos.length > 0) {
                                new_chat["profile_photo"] = ws.user.profile_photos[0];
                            }
                            let data_to_send = {
                                event: "you_have_new_message",
                                message: message,
                                chat_id: chat_id,
                            };
                            if (chat_created) {
                                // our method cannot know that when should will send the `new_chat`
                                data_to_send["chat_type"] = chat_type;
                                data_to_send["new_chat"] = new_chat;
                            }
                            target_ws.ws.send(JSON.stringify(data_to_send));
                        }
                        else {
                            console.log("E :: target_ws not found");
                        }
                    });
                }
            }
        }
        else if (chat_type == "channel") {
            const channel = yield chats_1.default.findOne({
                _id: chat_id,
            });
            // SECTION - checking user permissions
            if (channel && channel.creator_username && channel.members) {
                let user_is_aadmin;
                if (channel.admins && channel.admins.length > 0) {
                    user_is_aadmin = channel.admins.includes(ws.user.username);
                }
                if (channel.creator_username.trim() == ws.user.username.trim() || user_is_aadmin) {
                    let data_to_send = {
                        event: "you_have_new_message",
                        message: message,
                        chat_id: chat_id,
                    };
                    broadCastToAllMembers(channel.members, data_to_send, ws.user.username);
                    if (user_is_aadmin) {
                        const creator_ws = socket_1.users.find(({ username: _username_ }) => _username_ == channel.creator_username);
                        if (creator_ws) {
                            creator_ws.ws.send(JSON.stringify(data_to_send));
                        }
                    }
                }
                else {
                    console.log(`!! (channel.creator_username == ws.user.username || user_is_aadmin) !!`);
                }
                pushMessage(message, {
                    event: "send_text_message",
                    message: "message sended",
                    chat_id: chat_id,
                    message_callback: message,
                });
            }
        }
        else if (chat_type == "group") {
            const group = yield chats_1.default.findOne({
                _id: chat_id,
            });
            if (group) {
                // we check that the user is a member of the group
                let userIsMember;
                if (group.members && group.members.length > 0) {
                    userIsMember = group.members.includes(ws.user.username);
                }
                if (userIsMember || group.creator_username == ws.user.username) {
                    let data_to_send = {
                        event: "you_have_new_message",
                        message: message,
                        chat_id: chat_id,
                    };
                    if (group.members && group.members.length > 0) {
                        broadCastToAllMembers(group.members, data_to_send, ws.user.username);
                    }
                    if (ws.user.username != group.creator_username) {
                        // broadcast message to creator -> because name of creator is not in the members list
                        const creator_ws = yield socket_1.users.find(({ username: _username_ }) => _username_ === group.creator_username);
                        if (creator_ws) {
                            creator_ws.ws.send(JSON.stringify(data_to_send));
                        }
                    }
                    pushMessage(message, {
                        event: "send_text_message",
                        chat_id: chat_id,
                        message: "message sended",
                        message_callback: message,
                    });
                }
            }
            else {
                console.log(`${chat_id} group not found`);
            }
        }
    });
}
exports.handle_messages_socket = handle_messages_socket;
function join_to_chat(ws, parsedData) {
    return __awaiter(this, void 0, void 0, function* () {
        const chat_id = parsedData.chat_id;
        const chat = yield chats_1.default.findById(chat_id);
        if (chat) {
            if (chat.chat_type != "private" && chat.members) {
                const st = chat.members.includes(ws.user.username);
                if (!st && chat.creator_username != ws.user.username) {
                    const message = {
                        message_type: "join",
                        username: ws.user.username,
                    };
                    yield chats_1.default.findOneAndUpdate({ _id: chat_id }, {
                        $push: {
                            messages_list: message,
                        },
                    });
                    const user_have_chat = ws.user.chats.find(({ chat_id: _chat_id_ }) => _chat_id_ === chat_id);
                    if (!user_have_chat) {
                        pushChatToUserChatsList(ws.user.username, chat_id);
                    }
                    yield chats_1.default.findOneAndUpdate({ _id: chat_id }, {
                        $push: {
                            members: [ws.user.username],
                        },
                    });
                    ws.send(JSON.stringify({
                        event: "you_joined_into_a_chat",
                        chat_id: chat_id,
                    }));
                    const data_to_send = {
                        message: "new_member_joined",
                        username: ws.user.username,
                        chat_id: chat._id,
                    };
                    broadCastToAllMembers(chat.members, data_to_send, ws.user.username);
                    const chat_creator_ws = socket_1.users.find(({ username: _username_ }) => _username_ == chat.creator_username);
                    if (chat_creator_ws) {
                        chat_creator_ws.ws.send(JSON.stringify(data_to_send));
                    }
                }
                else {
                    console.log("the user is currently a member of this channel");
                }
            }
        }
    });
}
exports.join_to_chat = join_to_chat;
function get_chat_messages(ws, parsedData) {
    return __awaiter(this, void 0, void 0, function* () {
        const chat_id = parsedData.chat_id;
        if (chat_id && chat_id.length > 0) {
            const chat = yield chats_1.default.findById(chat_id);
            if (chat && chat.chat_type != "private") {
                ws.send(JSON.stringify({
                    event: "get_chat_messages",
                    chat_id: chat_id,
                    messages_list: chat.messages_list,
                }));
            }
        }
    });
}
exports.get_chat_messages = get_chat_messages;
function delete_message(ws, parsedData) {
    return __awaiter(this, void 0, void 0, function* () {
        const chat_id = parsedData.chat_id;
        const _message_id = parsedData.message_id;
        if (chat_id && chat_id.length > 0 && _message_id && _message_id.length > 0) {
            const chat = yield chats_1.default.findById(chat_id);
            if (chat) {
                const messages = chat.messages_list;
                const message_id_exists = messages.find(({ message_id }) => message_id === _message_id);
                if (message_id_exists) {
                    function do_delete_message() {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield chats_1.default.updateOne({ _id: chat_id }, {
                                $pull: {
                                    messages_list: {
                                        message_id: _message_id,
                                    },
                                },
                            });
                            ws.send(JSON.stringify({
                                message: "message deleted",
                                chat_id: chat_id,
                                message_id: _message_id,
                            }));
                        });
                    }
                    // Checking user permissions to this chat
                    if (chat.chat_type == "private") {
                        // both users can delete any message of their chat
                        do_delete_message();
                        const target_username = (0, users_1.findOutTUofChat)(chat, ws.user.username);
                        const target_ws = socket_1.users.find(({ username: _username_ }) => _username_ === target_username);
                        if (target_ws) {
                            target_ws.ws.send(JSON.stringify({
                                message: "message deleted",
                                chat_id: chat_id,
                                message_id: _message_id,
                            }));
                        }
                    }
                    else {
                        let user_is_aadmin;
                        if (chat.admins && chat.admins.length > 0) {
                            user_is_aadmin = chat.admins.includes(ws.user.username);
                        }
                        const is_user_message = messages.find(({ sender_username }) => sender_username == ws.user.username);
                        if (chat.creator_username == ws.user.username || user_is_aadmin || is_user_message) {
                            do_delete_message();
                            yield chats_1.default.updateOne({ _id: chat_id }, {
                                $pull: {
                                    messages_list: {
                                        message_id: _message_id,
                                    },
                                },
                            });
                            if (chat.members && chat.members.length > 0) {
                                const data_to_send = {
                                    message: "message deleted",
                                    chat_id: chat_id,
                                    message_id: _message_id,
                                };
                                broadCastToAllMembers(chat.members, data_to_send, ws.user.username);
                                const creator_ws = socket_1.users.find(({ username: _username_ }) => _username_ == chat.creator_username);
                                if (creator_ws) {
                                    creator_ws.ws.send(JSON.stringify(data_to_send));
                                }
                            }
                        }
                        else {
                            console.log("deleting message -> user not have required permissions");
                        }
                    }
                    if (message_id_exists && message_id_exists.filename) {
                        if (yield fs_1.default.existsSync(process.cwd() + messages_controller_1.photo_messages_directory + message_id_exists.filename)) {
                            yield fs_1.default.unlinkSync(process.cwd() + messages_controller_1.photo_messages_directory + message_id_exists.filename);
                        }
                        else {
                            console.log("photo deos not exists in /photo_messages_directory/");
                        }
                    }
                }
            }
            else {
                console.log("chat not found on deleting message");
            }
        }
    });
}
exports.delete_message = delete_message;
function getUserFullInfo(ws, parsedData) {
    return __awaiter(this, void 0, void 0, function* () {
        const chat_id = parsedData.chat_id;
        const chat_type = parsedData.chat_type;
        if (chat_id && chat_id.trim().length > 0 && chat_type && chat_type.trim().length > 0) {
            if (chat_type == "private") {
                if (parsedData.target_username && parsedData.target_username.trim().length > 0) {
                    const user = yield user_3.default.findOne({ username: parsedData.target_username });
                    const profile_photos = user.profile_photos.reverse();
                    var user_info_to_send = {
                        event: "get_chat_full_info",
                        user_info: {
                            full_name: user.full_name,
                            username: user.username,
                            bio: user.bio,
                            profile_photos: profile_photos,
                            last_seen: user.last_seen,
                        },
                    };
                    ws.send(JSON.stringify(user_info_to_send));
                }
            }
            else {
                const chat = yield chats_1.default.findOne({
                    _id: chat_id,
                });
                if (chat) {
                    if (chat.chat_type != "private") {
                        const profile_photos = [chat.profile_photos.reverse()[0]];
                        var user_info_to_send = {
                            event: "get_chat_full_info",
                            user_info: {
                                full_name: chat.full_name,
                                username: chat.username,
                                bio: chat.bio,
                                profile_photos: profile_photos,
                            },
                        };
                        if (chat.creator_username == ws.user.username) {
                            user_info_to_send["iam_creator"] = true;
                        }
                        else {
                            user_info_to_send["iam_creator"] = false;
                        }
                    }
                    if (user_info_to_send) {
                        function collect_members() {
                            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                                var _a;
                                const creator = yield user_3.default.findOne({
                                    username: chat.creator_username,
                                });
                                const creator_info = {
                                    full_name: creator.full_name,
                                    username: creator.username,
                                    rank: "creator",
                                    last_seen: creator.last_seen,
                                };
                                if (creator.profile_photos && creator.profile_photos.length > 0) {
                                    creator_info.profile_photos = [creator.profile_photos[creator.profile_photos.length - 1]];
                                }
                                if ((chat.chat_type == "group" ||
                                    (chat.chat_type == "channel" && (chat.creator_username == ws.user.username || ((_a = chat.admins) === null || _a === void 0 ? void 0 : _a.includes(ws.user.username))))) &&
                                    chat.members &&
                                    chat.members.length > 0) {
                                    let members_list = [];
                                    yield chat.members.forEach((member_username, index) => __awaiter(this, void 0, void 0, function* () {
                                        var _b;
                                        if ((_b = chat.members) === null || _b === void 0 ? void 0 : _b.length) {
                                            const user = yield user_3.default.findOne({
                                                username: member_username,
                                            });
                                            if (user) {
                                                let data_to_push = {
                                                    full_name: user.full_name,
                                                    username: user.username,
                                                    profile_photos: [user.profile_photos.reverse()[0]],
                                                    bio: user.bio,
                                                    last_seen: user.last_seen,
                                                };
                                                if (chat.admins) {
                                                    const user_is_aadmin = chat.admins.includes(member_username);
                                                    data_to_push["rank"] = user_is_aadmin == true ? "admin" : "member";
                                                }
                                                members_list.push(data_to_push);
                                            }
                                            if (index == chat.members.length - 1) {
                                                if (chat.chat_type != "private") {
                                                    members_list.push(creator_info);
                                                }
                                                resolve(members_list);
                                            }
                                        }
                                    }));
                                }
                                else {
                                    if (chat.chat_type != "private") {
                                        resolve([creator_info]);
                                    }
                                    else {
                                        resolve([]);
                                    }
                                }
                            }));
                        }
                        yield collect_members().then((data) => {
                            if (data) {
                                user_info_to_send.user_info.members = data;
                            }
                        });
                        ws.send(JSON.stringify(user_info_to_send));
                    }
                }
            }
        }
    });
}
exports.getUserFullInfo = getUserFullInfo;
function delete_chat(ws, parsedData) {
    return __awaiter(this, void 0, void 0, function* () {
        const chat_id = parsedData.chat_id;
        if (chat_id && chat_id.length > 0) {
            const chat = yield chats_1.default.findOne({ _id: chat_id });
            if (chat && chat.chat_type == "private") {
                const user = yield user_3.default.findOne({
                    username: ws.user.username,
                });
                if (user && user.chats) {
                    const user_have_chat = user.chats.find(({ chat_id: _chat_id_ }) => _chat_id_ == chat_id);
                    if (user_have_chat != null) {
                        var data_to_send = {
                            message: "chat_deleted",
                            chat_id: chat_id,
                        };
                        ws.send(JSON.stringify(data_to_send));
                        if (chat.sides) {
                            const other_side_username = (0, users_1.findOutTUofChat)(chat, ws.user.username);
                            if (other_side_username) {
                                const other_side_ws = socket_1.users.find(({ username: _username_ }) => _username_ == other_side_username);
                                if (other_side_ws) {
                                    other_side_ws.ws.send(JSON.stringify(data_to_send));
                                }
                                else {
                                    console.log("other_side_ws not found on delete_chat event");
                                }
                            }
                            else {
                                console.log("other_side_username not found on delete_chat event");
                            }
                        }
                        yield user_3.default.updateOne({ username: ws.user.username }, {
                            $pull: {
                                chats: {
                                    chat_id: chat_id,
                                },
                            },
                        });
                        yield chats_1.default.deleteOne({ chat_id: chat_id });
                    }
                    else {
                        console.log("user_have_chat is empty on delete_chat event");
                    }
                }
                else {
                    console.log("user_not found on delete_chat event");
                }
            }
            else {
                console.log("chat deos not exists or chat_type is not private");
            }
        }
    });
}
exports.delete_chat = delete_chat;
function change_member_access(ws, parsedData) {
    return __awaiter(this, void 0, void 0, function* () {
        const chat_id = parsedData.chat_id;
        const member_username = parsedData.member_username;
        const rank = parsedData.rank;
        if (chat_id && chat_id.length > 0 && rank && rank.length > 0 && member_username && member_username.length > 0) {
            const chat = yield chats_1.default.findOne({
                _id: chat_id,
            });
            if (chat && chat.chat_type != "private") {
                const member = yield user_3.default.findOne({ username: member_username });
                const member_ws = socket_1.users.find(({ username: _username_ }) => _username_ == member_username.trim());
                if (member) {
                    // SECTION - checking user permissions
                    if (chat.admins) {
                        function do_response() {
                            const data_to_send = {
                                message: "rank changed",
                                chat_id: chat_id,
                                new_rank: rank,
                                member_username: member_username,
                            };
                            ws.send(JSON.stringify(data_to_send));
                            if (member_ws) {
                                member_ws.ws.send(JSON.stringify(data_to_send));
                            }
                        }
                        const check_user_is_admin = chat.admins.includes(member_username);
                        if (chat.creator_username == ws.user.username) {
                            if (rank == "admin") {
                                if (!check_user_is_admin) {
                                    yield chats_1.default.updateOne({ _id: chat_id }, {
                                        $push: {
                                            admins: member_username,
                                        },
                                    });
                                    do_response();
                                }
                                else {
                                    console.log("user already is a admin");
                                }
                            }
                            else if (rank == "member") {
                                if (check_user_is_admin) {
                                    yield chats_1.default.updateOne({ _id: chat_id }, {
                                        $pull: {
                                            admins: member_username,
                                        },
                                    });
                                    do_response();
                                }
                                else {
                                    console.log("user is not a admin");
                                }
                            }
                        }
                        else {
                            console.log("user dont have permissions to change a member's permissions");
                        }
                    }
                }
                else {
                    console.log("member not found on change_member_access event");
                }
            }
            else {
                console.log("chat not found on change_member_access");
            }
        }
    });
}
exports.change_member_access = change_member_access;
// TODO
function user_seened_message(ws, parsedData) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.user_seened_message = user_seened_message;
