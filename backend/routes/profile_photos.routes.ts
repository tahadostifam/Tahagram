import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import validate_body from "../lib/handle_body_validator";
import auth_middleware from "../middlewares/auth";
const router = express.Router();

import ProfilePhotosController from "../controllers/profile_photos_controller";

router.post("/upload_photo", auth_middleware, (req: Request, res: Response, next: NextFunction) => {
    ProfilePhotosController.UploadPhotoAction(req, res, next);
});

export default router;