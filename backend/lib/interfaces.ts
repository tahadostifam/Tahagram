import { Request } from "express";
import { WebSocket } from "ws";

export interface ISocketClient {
    uuid: string;
    username: string;
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
    profile_photos: IProfilePhoto[];
    chats: IChat[];
}

export interface IProfilePhoto {
    filename: string;
}

export interface IChat {
    chat_id?: string;
    _id?: string;
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

export interface IMiddleWareRequest extends Request {
    username: string;
    user_info: IUser;
}

export interface IPrivateRoom {
    user_1: {
        username: string;
        ws: IWebSocket;
    };
    user_2: {
        username: string;
        ws: IWebSocket;
    };
}
