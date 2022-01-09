import { Request, Response, NextFunction } from "express";
import { clientIp, cleanIpDots } from "../lib/client_ip";
import * as database from "../lib/database";
import status_codes from "../lib/status_codes";
import store, { makeUserStoreId, setUserTokens } from "../lib/store";

export default {
    GetChatsListAction: async (req: Request, res: Response, next: NextFunction) => {
        res.send("ok");
    },
};
