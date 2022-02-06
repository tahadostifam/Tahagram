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
    chats: IUserChatLink[];
}

export interface IUserChatLink {
    chat_id: string;
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
    full_name?: string;
    bio?: string;
    target_username?: string;
    creator_username?: string;
    members?: Array<string>;
    admins?: Array<any>;
    chat_type: string;
    messages_list: [ITextMessage | IImageMessage];
    iam_admin_of_chat?: boolean;
    iam_amember_of_chat?: boolean;
    profile_photos: Array<any>;
}

export interface ITextMessage {
    message_id: string;
    sender_username?: string;
    message_type: string;
    send_time: number;
    content: string;
    edited: boolean;
    seen_state?: string;
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

export interface IRoomUser {
    username: string;
    ws: IWebSocket;
}
