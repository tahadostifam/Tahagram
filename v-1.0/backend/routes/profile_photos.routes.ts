import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import validate_body from "../lib/handle_body_validator";
import auth_middleware from "../middlewares/auth";
const router = express.Router();

import ProfilePhotosController from "../controllers/profile_photos_controller";
import { IMiddleWareRequest } from "../lib/interfaces";

router.post("/upload_photo", auth_middleware, (req: any, res: Response, next: NextFunction) => {
    ProfilePhotosController.UploadPhotoAction(req, res, next);
});

router.post(
    "/remove_profile_photo",
    auth_middleware,
    body("filename").notEmpty().withMessage("Filename can't be empty"),
    validate_body,
    (req: any, res: Response, next: NextFunction) => {
        ProfilePhotosController.RemoveProfilePhotoAction(req, res, next);
    }
);

export default router;
