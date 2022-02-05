// SECTION - events
import search_in_chats from "./search_in_chats";
import { update_full_name, update_bio, delete_message, getUserFullInfo } from "./users";
import { check_username_existly, create_channel, get_chat_messages, join_to_chat, send_text_message, user_seened_message } from "./chats";

export default {
    search_in_chats: search_in_chats,
    update_full_name: update_full_name,
    update_bio: update_bio,
    send_text_message: send_text_message,
    delete_message: delete_message,
    user_seened_message: user_seened_message,
    get_user_full_info: getUserFullInfo,
    create_channel: create_channel,
    check_username_existly: check_username_existly,
    get_chat_messages: get_chat_messages,
    join_to_chat: join_to_chat,
};
