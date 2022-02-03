import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import validate_body from "../lib/handle_body_validator";
import auth_middleware from "../middlewares/auth";
const router = express.Router();

import ChatsController from "../controllers/chats_controller";

router.post(
    "/create_channel",
    auth_middleware,
    body("channel_name").notEmpty().withMessage("ChannelName can't be empty"),
    body("channel_username").notEmpty().withMessage("ChannelUsername can't be empty"),
    validate_body,
    (req: any, res: Response, next: NextFunction) => {
        ChatsController.CreateChannelAction(req, res, next);
    }
);

router.post(
    "/create_group",
    auth_middleware,
    body("group_name").notEmpty().withMessage("GroupName can't be empty"),
    body("group_username").notEmpty().withMessage("GroupUsername can't be empty"),
    validate_body,
    (req: any, res: Response, next: NextFunction) => {
        ChatsController.CreateGroupAction(req, res, next);
    }
);

export default router;
