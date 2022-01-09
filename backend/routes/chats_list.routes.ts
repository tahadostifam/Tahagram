import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import validate_body from "../lib/handle_body_validator";
import auth_middleware from "../middlewares/auth";
const router = express.Router();

import ChatsListController from "../controllers/chats_list_controller";

router.post("/get_chats_list", auth_middleware, (req: Request, res: Response, next: NextFunction) => {
    ChatsListController.GetChatsListAction(req, res, next);
});

export default router;
