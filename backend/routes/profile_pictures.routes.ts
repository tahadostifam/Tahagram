import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import validate_body from "../lib/handle_body_validator";
import auth_middleware from "../middlewares/auth";
const router = express.Router();

import ProfilePicturesController from "../controllers/profile_pictures_controller";

router.post("/upload_picture", auth_middleware, (req: Request, res: Response, next: NextFunction) => {
    ProfilePicturesController.UploadPictureAction(req, res, next);
});

export default router;
