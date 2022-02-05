import User from "../../models/user";
import Chats from "../../models/chats";
import { IChat } from "../../lib/interfaces";

export default async function search_in_chats(ws: any, parsedData: any) {
    if (parsedData.input && parsedData.input.trim() != "") {
        // SECTION - in this section we gonna search in users_collection
        // we do it because probably user wants to dm to a user
        let finded_users = await User.find(
            {
                $or: [{ username: { $regex: ".*" + parsedData.input + ".*" } }, { full_name: { $regex: ".*" + parsedData.input + ".*" } }],
            },
            {
                password_digest: 0,
                __v: 0,
                chats: 0,
                bio: 0,
            }
        );

        finded_users = JSON.parse(JSON.stringify(finded_users));

        if (finded_users) {
            await finded_users.forEach((item, index) => {
                if (item.profile_photos && item.profile_photos.length > 0) {
                    finded_users[index]["profile_photo"] = item.profile_photos[0];
                    delete finded_users[index].profile_photos;
                }

                if (item && item.username == ws.user.username) {
                    finded_users.splice(index);
                }
            });
        } else {
            finded_users = [];
        }

        // SECTION - searching in channels&groups section

        let channels_and_groups = await Chats.find(
            {
                $and: [
                    { $or: [{ chat_type: "channel" }, { chat_type: "group" }] },
                    { $or: [{ username: { $regex: ".*" + parsedData.input + ".*" } }, { full_name: { $regex: ".*" + parsedData.input + ".*" } }] },
                ],
            },
            {
                __v: 0,
                bio: 0,
                members: 0,
                admins: 0,
                messages_list: 0,
            }
        );

        channels_and_groups = JSON.parse(JSON.stringify(channels_and_groups));

        if (!channels_and_groups) {
            channels_and_groups = [];
        }

        await channels_and_groups.forEach(async (item: IChat, index) => {
            let user_is_member = false;
            if (item.members) {
                await item.members.forEach((mu) => {
                    if (mu == ws.user.username) {
                        user_is_member = true;
                        return;
                    }
                });
                channels_and_groups[index]["joined"] = user_is_member;
            }
        });

        const data_to_send = finded_users.concat(channels_and_groups);
        ws.send(
            JSON.stringify({
                event: "search_in_chats",
                data: data_to_send,
            })
        );
    }
}
