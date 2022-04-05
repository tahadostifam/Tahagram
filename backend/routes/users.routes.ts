import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import validate_body from "../lib/handle_body_validator";
const router = express.Router();

import UsersController from "../controllers/users_controller";

router.post(
    "/signin",
    body("email").notEmpty().withMessage("Email can't be empty"),
    validate_body,
    (req: Request, res: Response, next: NextFunction) => {
        UsersController.SigninAction(req, res, next);
    }
);

router.post(
    "/signin_with_code",
    body("email").notEmpty().withMessage("Email can't be empty"),
    body("verific_code").notEmpty().withMessage("VerificCode can't be empty"),
    validate_body,
    (req: Request, res: Response, next: NextFunction) => {
        UsersController.SigninWithCode(req, res, next);
    }
);

router.post("/authentication", (req: Request, res: Response, next: NextFunction) => {
    UsersController.AuthenticationAction(req, res, next);
});

export default router;
