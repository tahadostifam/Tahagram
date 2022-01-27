import { WebSocket } from "ws";

export interface ISocketClient {
    uuid: string;
    ws: IWebSocket;
}

export interface IWebSocket extends WebSocket {
    user: IUser;
    uuid: string;
}

export interface IUser {
    _id: string;
    full_name: string;
    username: string;
    password_digest: string;
    bio: string;
    last_seen: string;
    chats: IChat;
    profile_photos: IProfilePhoto[];
}

export interface IProfilePhoto {
    filename: string;
}

export interface IChat {
    _id: string;
    sides?: {
        user_1: string;
        user_2: string;
    };
    username?: string;
    bio?: string;
    chat_type: string;
    messages_list: [ITextMessage | IImageMessage];
}

export interface ITextMessage {
    message_id: string;
    sender_username: string;
    messages_type: string;
    send_time: number;
    content: string;
    edited: boolean;
}

export interface IImageMessage {
    // TODO
}
