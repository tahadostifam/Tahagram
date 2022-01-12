import { Request, Response, NextFunction } from "express";
import { clientIp, cleanIpDots } from "../lib/client_ip";
import * as database from "../lib/database";
import status_codes from "../lib/status_codes";
import store, { makeUserStoreId, setUserTokens } from "../lib/store";

export default {
    Action: async (req: any, res: Response, next: NextFunction) => {},
};

export function getChatsList(username: string) {
    return new Promise((success, error) => {
        database;
        // TODO
        // .exec_query(
        //     "SELECT tbl_users.full_name, tbl_users.username, tbl_users.bio from tbl_users RIGHT JOIN tbl_chats_list ON user_username=tbl_users.username WHERE tbl_chats_list.haver_username=$1",
        //     [username]
        // )
        // .then(
        //     (chats_list) => {
        //         if (chats_list) {
        //             success(chats_list);
        //         }
        //     },
        //     () => error()
        // );
    });
}
