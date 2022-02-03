import User from "../../models/user";
import Chats from "../../models/chats";
import { ObjectId } from "mongodb";
import { createPrivateRoom, rooms } from "../room_manager";

import { IChat, ISocketClient, IWebSocket } from "../../lib/interfaces";
import { users } from "../socket";

export async function update_full_name(ws: IWebSocket, parsedData: any) {
    if (parsedData.full_name && parsedData.full_name.trim() != "") {
        const update = await User.findOneAndUpdate(
            {
                username: ws.user.username,
            },
            {
                full_name: parsedData.full_name,
            }
        );
        if (update) {
            ws.send(
                JSON.stringify({
                    message: "full_name updated",
                    full_name: parsedData.full_name,
                })
            );
        }
    }
}

export async function update_bio(ws: IWebSocket, parsedData: any) {
    if (parsedData.bio && parsedData.bio.trim() != "") {
        const update = await User.findOneAndUpdate(
            {
                username: ws.user.username,
            },
            {
                bio: parsedData.bio,
            }
        );
        if (update) {
            ws.send(
                JSON.stringify({
                    message: "bio updated",
                    bio: parsedData.bio,
                })
            );
        }
    }
}

export async function send_text_message(ws: IWebSocket, parsedData: any) {
    const chat_id = parsedData.chat_id;
    const message_text = parsedData.send_text_message_input;
    const target_username = parsedData.target_username;

    if (message_text && message_text.trim() != "" && chat_id && chat_id.trim() != "" && target_username && target_username.length > 0) {
        if (target_username != ws.user.username) {
            const message_id = new ObjectId().toString();
            const message = {
                message_id: message_id,
                sender_username: ws.user.username,
                message_type: "text",
                send_time: Date.now(),
                content: message_text,
                edited: false,
                seen_state: "sended",
            };

            async function pushMessage(response: object) {
                const result = await Chats.findOneAndUpdate(
                    { _id: chat_id },
                    {
                        $push: {
                            messages_list: message,
                        },
                    }
                );

                ws.send(JSON.stringify(response));
            }

            var target_ws: ISocketClient | undefined;
            let chat: IChat = await Chats.findOne({
                $or: [{ sides: { user_1: ws.user.username, user_2: target_username } }, { sides: { user_1: target_username, user_2: ws.user.username } }],
            });

            function setTargetWs() {
                target_ws = users.find(({ username: _username_ }) => _username_ === target_username);
            }

            if (chat) {
                await setTargetWs();

                if (!target_ws || String(target_ws).trim() == "") {
                    target_ws = undefined;
                }
            }

            if (chat) {
                await setTargetWs();

                pushMessage({
                    event: "send_text_message",
                    chat_id: chat_id,
                    message: "message sended",
                    message_callback: message,
                });

                if (chat.chat_type == "private") {
                    const room = rooms[chat_id];
                    if (room) {
                        if (target_ws) {
                            broadCastToOtherSide(target_ws, chat.chat_type, false);
                        } else {
                            console.error("B :: cannot find target_ws");
                        }
                    } else {
                        if (chat._id && target_username) {
                            createPrivateRoom(chat._id, ws.user.username, target_username).then((room) => {
                                if (target_ws) {
                                    broadCastToOtherSide(target_ws, chat.chat_type, true);
                                } else {
                                    console.error("C :: cannot find target_ws");
                                }
                            });
                        } else {
                            console.error("chat._id or target_username or target_ws is empty");
                        }
                    }
                } else {
                    // TODO
                    console.error("chat is not private :)");
                }
            } else {
                await setTargetWs();

                // we must create a new private_chat
                const user = await User.findOne({
                    username: target_username,
                });
                if (user) {
                    var new_chat = new Chats({
                        chat_type: "private",
                        messages_list: message,
                        sides: {
                            user_1: ws.user.username,
                            user_2: target_username,
                        },
                    });
                    await new_chat.save();
                    // Add this chat into user_1 and user_2 chats_list
                    async function pushChatToUserChatsList(username: String) {
                        await User.updateOne(
                            {
                                username: username,
                            },
                            {
                                $push: {
                                    chats: {
                                        chat_id: new_chat._id, // the id of chat [chats collection]
                                    },
                                },
                            }
                        );
                    }

                    pushChatToUserChatsList(ws.user.username);
                    pushChatToUserChatsList(target_username);

                    // to the sender
                    pushMessage({
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
                    createPrivateRoom(new_chat._id, ws.user.username, target_username).then(() => {
                        if (target_ws) {
                            let data_to_send: any = {
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
                    });
                }
            }

            async function broadCastToOtherSide(target_ws: ISocketClient | undefined, chat_type: string, chat_created: boolean) {
                if (target_ws) {
                    const new_chat: any = {
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
                    let data_to_send: any = {
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
            }
        }
    }
}

export async function delete_message(ws: IWebSocket, parsedData: any) {
    const chat_id = parsedData.chat_id;
    const _message_id = parsedData.message_id;
    if (chat_id && chat_id.length > 0 && _message_id && _message_id.length > 0) {
        const chat = await Chats.findById(chat_id);
        if (chat) {
            const messages: Array<any> = chat.messages_list;
            const message_id_exists = messages.find(({ message_id }) => message_id === _message_id);

            if (message_id_exists) {
                await Chats.updateOne(
                    { _id: chat_id },
                    {
                        $pull: {
                            messages_list: {
                                message_id: _message_id,
                            },
                        },
                    }
                );
                ws.send(
                    JSON.stringify({
                        message: "message deleted",
                        chat_id: chat_id,
                        message_id: _message_id,
                    })
                );

                const target_username = findOutTUofChat(chat, ws.user.username);
                const target_ws = users.find(({ username: _username_ }) => _username_ === target_username);
                if (target_ws) {
                    target_ws.ws.send(
                        JSON.stringify({
                            message: "message deleted",
                            chat_id: chat_id,
                            message_id: _message_id,
                        })
                    );
                }
            }
        }
    }
}

export function findOutTUofChat(chat: IChat, username: string) {
    if (chat.sides?.user_1 != username) {
        return chat.sides?.user_1;
    } else if (chat.sides?.user_2 != username) {
        return chat.sides?.user_2;
    } else {
        return null;
    }
}

export async function getUserFullInfo(ws: IWebSocket, parsedData: any) {
    const target_username = parsedData.target_username;
    if (target_username && target_username.length > 0 && target_username != ws.user.username) {
        const user = await User.findOne({
            username: target_username,
        });
        if (user) {
            const profile_photos = user.profile_photos.reverse();
            let user_info_to_send: any = {
                event: "get_user_full_info",
                user_info: {
                    full_name: user.full_name,
                    username: user.username,
                    bio: user.bio,
                    profile_photos: profile_photos,
                },
            };
            ws.send(JSON.stringify(user_info_to_send));
        }
    }
}

// TODO
export async function user_seened_message(ws: IWebSocket, parsedData: any) {}
