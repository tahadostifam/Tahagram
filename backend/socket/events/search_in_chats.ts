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
                    finded_users[index]["profile_photo"] = item.profile_photos.reverse()[0];
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

        let channels_and_groups: any = await Chats.find(
            {
                $and: [
                    { $or: [{ chat_type: "channel" }, { chat_type: "group" }] },
                    { $or: [{ username: { $regex: ".*" + parsedData.input + ".*" } }, { full_name: { $regex: ".*" + parsedData.input + ".*" } }] },
                ],
            },
            {
                __v: 0,
                bio: 0,
                messages_list: 0,
            }
        );

        channels_and_groups = JSON.parse(JSON.stringify(channels_and_groups));

        if (!channels_and_groups) {
            channels_and_groups = [];
        }

        await channels_and_groups.forEach(async (item: IChat, index: number) => {
            if (item.admins) {
                const iam_admin_of_chat = item.admins.includes(ws.user.username);
                const iam_creator_of_chat = item.creator_username == ws.user.username;
                channels_and_groups[index]["iam_admin_of_chat"] = iam_admin_of_chat || iam_creator_of_chat;
            }
            if (item["iam_admin_of_chat"] != true && item.members) {
                const iam_amember_of_chat = item.members.includes(ws.user.username);
                channels_and_groups[index]["iam_amember_of_chat"] = iam_amember_of_chat;
            }
            delete channels_and_groups[index]["members"];
            delete channels_and_groups[index]["admins"];
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
