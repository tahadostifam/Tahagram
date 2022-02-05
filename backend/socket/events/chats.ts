import User from "../../models/user";
import Chats from "../../models/chats";
import { createPrivateRoom, rooms } from "../room_manager";
import { IChat, ISocketClient, ITextMessage, IWebSocket } from "../../lib/interfaces";
import { users } from "../socket";
import { ObjectId } from "mongodb";

export async function create_channel(ws: IWebSocket, parsedData: any) {
    const channel_username = parsedData.channel_username;
}

export async function check_username_existly(ws: IWebSocket, parsedData: any) {
    const username = parsedData.username;
    if (username && username.length > 0) {
        const chat = await Chats.findOne({
            username: username,
        });
        const user = await User.findOne({
            username: username,
        });
        if (chat || user) {
            ws.send(
                JSON.stringify({
                    message: "chat exists",
                    username: username,
                })
            );
        } else {
            ws.send(
                JSON.stringify({
                    message: "chat not exists",
                    username: username,
                })
            );
        }
    }
}

export async function send_text_message(ws: IWebSocket, parsedData: any) {
    const chat_id = parsedData.chat_id;
    const chat_type = parsedData.chat_type;
    const message_text = parsedData.send_text_message_input;
    const target_username = parsedData.target_username;

    if (message_text && message_text.trim() != "" && chat_id && chat_id.trim() != "" && chat_type && chat_type.length > 0) {
        const message_id = new ObjectId().toString();

        async function pushMessage(message: ITextMessage, response: object) {
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

        if (chat_type == "private") {
            const message: ITextMessage = {
                message_id: message_id,
                sender_username: ws.user.username,
                message_type: "text",
                send_time: Date.now(),
                content: message_text,
                edited: false,
                seen_state: "sended",
            };
            if (target_username && target_username.length > 0 && target_username != ws.user.username) {
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
                    // await setTargetWs(); FIXME

                    pushMessage(message, {
                        event: "send_text_message",
                        chat_id: chat_id,
                        message: "message sended",
                        message_callback: message,
                    });

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
        } else if (chat_type == "channel") {
            const channel = await Chats.findOne({
                _id: chat_id,
            });

            // SECTION - checking user permissions
            if (channel) {
                const message: ITextMessage = {
                    message_id: message_id,
                    message_type: "text",
                    send_time: Date.now(),
                    content: message_text,
                    edited: false,
                    sender_username: ws.user.username,
                };
                if (channel.creator_username == ws.user.username) {
                    pushMessage(message, {
                        event: "send_text_message",
                        chat_id: chat_id,
                        message: "message sended",
                        message_callback: message,
                    });

                    // TODO - broadcast message to all members
                } else {
                    console.log(`${chat_id} channel not found`);
                }
            }
        }
    }
}

export async function get_chat_messages(ws: IWebSocket, parsedData: any) {
    const chat_id = parsedData.chat_id;
    if (chat_id && chat_id.length > 0) {
        const chat = await Chats.findById(chat_id);
        if (chat && chat.chat_type != "private") {
            ws.send(
                JSON.stringify({
                    event: "get_chat_messages",
                    chat_id: chat_id,
                    messages_list: chat.messages_list,
                })
            );
        }
    }
}

// TODO
export async function user_seened_message(ws: IWebSocket, parsedData: any) {}
