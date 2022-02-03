import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import validate_body from "../lib/handle_body_validator";
import auth_middleware from "../middlewares/auth";
const router = express.Router();

import MessagesController from "../controllers/messages_controller";
import { IMiddleWareRequest } from "../lib/interfaces";

router.post(
    "/new_photo_message",
    auth_middleware,
    body("chat_id").notEmpty().withMessage("ChatId can't be empty"),
    validate_body,
    (req: any, res: Response, next: NextFunction) => {
        MessagesController.NewPhotoMessageAction(req, res, next);
    }
);

export default router;
