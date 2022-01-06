import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import validate_body from "../lib/handle_body_validator";
const router = express.Router();

import UsersController from "../controllers/users_controller";

router.post(
    "/signup",
    body("full_name").notEmpty().withMessage("Full Name can't be empty"),
    body("username").notEmpty().withMessage("Full Name can't be empty"),
    body("username").isLength({ min: 5, max: 15 }).withMessage("Username must be at least 5 and at most 15 characters"),
    body("password").notEmpty().withMessage("Full Name can't be empty"),
    validate_body,
    (req: Request, res: Response, next: NextFunction) => {
        UsersController.SignupAction(req, res, next);
    }
);

router.post(
    "/signin",
    body("username").notEmpty().withMessage("Username can't be empty"),
    body("password").notEmpty().withMessage("Password can't be empty"),
    validate_body,
    (req: Request, res: Response, next: NextFunction) => {
        UsersController.SigninAction(req, res, next);
    }
);

router.post(
    "/refresh_token",
    body("refresh_token").notEmpty().withMessage("RefreshToken can't be empty"),
    validate_body,
    (req: Request, res: Response, next: NextFunction) => {
        UsersController.RefreshTokenAction(req, res, next);
    }
);

export default router;
