// SECTION - events
import search_in_chats from "./search_in_chats";
import { update_full_name, update_bio, get_last_seen } from "./users";
import {
    check_username_existly,
    get_chat_messages,
    getUserFullInfo,
    delete_message,
    join_to_chat,
    send_text_message,
    user_seened_message,
    delete_chat,
    change_member_access,
} from "./chats";

export default {
    search_in_chats: search_in_chats,
    update_full_name: update_full_name,
    update_bio: update_bio,
    send_text_message: send_text_message,
    delete_message: delete_message,
    user_seened_message: user_seened_message,
    get_chat_full_info: getUserFullInfo,
    check_username_existly: check_username_existly,
    get_chat_messages: get_chat_messages,
    join_to_chat: join_to_chat,
    get_last_seen: get_last_seen,
    delete_chat: delete_chat,
    change_member_access: change_member_access,
};
