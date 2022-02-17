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
const chats_controller_1 = __importDefault(require("../controllers/chats_controller"));
router.post("/create_channel", auth_1.default, (0, express_validator_1.body)("channel_name").notEmpty().withMessage("ChannelName can't be empty"), (0, express_validator_1.body)("channel_username").notEmpty().withMessage("ChannelUsername can't be empty"), handle_body_validator_1.default, (req, res, next) => {
    chats_controller_1.default.CreateChannelAction(req, res, next);
});
router.post("/create_group", auth_1.default, (0, express_validator_1.body)("group_name").notEmpty().withMessage("GroupName can't be empty"), (0, express_validator_1.body)("group_username").notEmpty().withMessage("GroupUsername can't be empty"), handle_body_validator_1.default, (req, res, next) => {
    chats_controller_1.default.CreateGroupAction(req, res, next);
});
exports.default = router;
