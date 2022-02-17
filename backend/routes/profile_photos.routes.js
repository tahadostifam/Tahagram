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
const profile_photos_controller_1 = __importDefault(require("../controllers/profile_photos_controller"));
router.post("/upload_photo", auth_1.default, (req, res, next) => {
    profile_photos_controller_1.default.UploadPhotoAction(req, res, next);
});
router.post("/remove_profile_photo", auth_1.default, (0, express_validator_1.body)("filename").notEmpty().withMessage("Filename can't be empty"), handle_body_validator_1.default, (req, res, next) => {
    profile_photos_controller_1.default.RemoveProfilePhotoAction(req, res, next);
});
exports.default = router;
