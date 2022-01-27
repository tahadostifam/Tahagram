// SECTION - events
import search_in_chats from "./search_in_chats";
import { update_full_name, update_bio, send_text_message, delete_message } from "./users";

export default {
    search_in_chats: search_in_chats,
    update_full_name: update_full_name,
    update_bio: update_bio,
    send_text_message: send_text_message,
    delete_message: delete_message,
};
