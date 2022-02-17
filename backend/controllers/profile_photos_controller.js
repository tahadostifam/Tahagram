"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.justImageFile = exports.profile_photos_directory = void 0;
const status_codes_1 = __importDefault(require("../lib/status_codes"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const user_1 = __importDefault(require("../models/user"));
exports.profile_photos_directory = "/uploads/profile_photos/";
function justImageFile(file) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        return true;
    }
    return false;
}
exports.justImageFile = justImageFile;
exports.default = {
    UploadPhotoAction: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.files || !req.files["photo"]) {
            res.statusCode = 400;
            return res.send({
                errors: [
                    {
                        msg: "Photo can't be empty",
                        param: "photo",
                        location: "body",
                    },
                ],
            });
        }
        const photo = req.files["photo"];
        if (justImageFile(photo)) {
            const user = yield user_1.default.findOne({
                username: req.headers.username,
            });
            if (!user)
                return status_codes_1.default.invalid_token(req, res, next);
            let final_filename;
            function generateRandomFileName() {
                return __awaiter(this, void 0, void 0, function* () {
                    final_filename = yield crypto_1.default.randomBytes(15).toString("hex");
                    if (fs_1.default.existsSync(exports.profile_photos_directory + final_filename)) {
                        console.log("bad filename :)");
                        yield generateRandomFileName();
                    }
                });
            }
            yield generateRandomFileName();
            try {
                yield photo.mv(process.cwd() + exports.profile_photos_directory + final_filename);
            }
            catch (_a) {
                status_codes_1.default.error(req, res, next);
            }
            yield user_1.default.updateOne({
                username: req.headers.username,
            }, {
                $push: {
                    profile_photos: {
                        filename: final_filename,
                    },
                },
            });
            status_codes_1.default.profile_photo_uploaded({
                profile_photo_filename: final_filename,
            }, req, res, next);
        }
        else {
            status_codes_1.default.file_not_valid(req, res, next);
        }
    }),
    RemoveProfilePhotoAction: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const filename = req.body.filename;
        const user = yield user_1.default.findOne({
            username: req.headers.username,
        });
        if (user) {
            const is_users_profile = user.profile_photos.find(({ filename: _filename_ }) => _filename_ == filename);
            if (is_users_profile) {
                yield user_1.default.updateOne({
                    username: req.headers.username,
                }, {
                    $pull: {
                        profile_photos: {
                            filename: filename,
                        },
                    },
                });
                status_codes_1.default.profile_photo_removed(req, res, next);
                if (yield fs_1.default.existsSync(process.cwd() + exports.profile_photos_directory + filename)) {
                    yield fs_1.default.unlinkSync(process.cwd() + exports.profile_photos_directory + filename);
                }
                else {
                    console.log("profile_photo deos not exists in /profile_photos_directory/");
                }
            }
            else {
                status_codes_1.default.cannot_remove_profile_photo(req, res, next);
            }
        }
        else {
            return status_codes_1.default.invalid_token(req, res, next);
        }
    }),
};
