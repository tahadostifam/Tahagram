"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const handle_body_validator_1 = __importDefault(require("../lib/handle_body_validator"));
const router = express_1.default.Router();
const users_controller_1 = __importDefault(require("../controllers/users_controller"));
router.post("/signup", (0, express_validator_1.body)("full_name").notEmpty().withMessage("Full Name can't be empty"), (0, express_validator_1.body)("username").notEmpty().withMessage("Username can't be empty"), (0, express_validator_1.body)("username").isLength({ min: 5, max: 15 }).withMessage("Username must be at least 5 and at most 15 characters"), (0, express_validator_1.body)("password").notEmpty().withMessage("Password can't be empty"), handle_body_validator_1.default, (req, res, next) => {
    users_controller_1.default.SignupAction(req, res, next);
});
router.post("/signin", (0, express_validator_1.body)("username").notEmpty().withMessage("Username can't be empty"), (0, express_validator_1.body)("password").notEmpty().withMessage("Password can't be empty"), handle_body_validator_1.default, (req, res, next) => {
    users_controller_1.default.SigninAction(req, res, next);
});
router.post("/refresh_token", (0, express_validator_1.body)("refresh_token").notEmpty().withMessage("RefreshToken can't be empty"), handle_body_validator_1.default, (req, res, next) => {
    users_controller_1.default.RefreshTokenAction(req, res, next);
});
router.post("/auth", (0, express_validator_1.body)("auth_token").notEmpty().withMessage("AuthToken can't be empty"), (0, express_validator_1.body)("username").notEmpty().withMessage("Username can't be empty"), handle_body_validator_1.default, (req, res, next) => {
    users_controller_1.default.AuthenticationAction(req, res, next);
});
exports.default = router;
