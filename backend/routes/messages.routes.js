"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const handle_body_validator_1 = __importDefault(require("../lib/handle_body_validator"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
const messages_controller_1 = __importDefault(require("../controllers/messages_controller"));
router.post("/new_photo_message", auth_1.default, (0, express_validator_1.body)("chat_id").notEmpty().withMessage("ChatId can't be empty"), (0, express_validator_1.body)("chat_type").notEmpty().withMessage("ChatType can't be empty"), handle_body_validator_1.default, (req, res, next) => {
    messages_controller_1.default.NewPhotoMessageAction(req, res, next);
});
exports.default = router;
