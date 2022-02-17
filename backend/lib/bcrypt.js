"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.makeHashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 12;
function makeHashPassword(password) {
    return new Promise((success, error) => {
        bcrypt_1.default.genSalt(saltRounds, function (err, salt) {
            if (err)
                return error();
            bcrypt_1.default.hash(password, salt, function (err, hash) {
                if (err)
                    return error();
                success(hash);
            });
        });
    });
}
exports.makeHashPassword = makeHashPassword;
function comparePassword(password, hash) {
    return new Promise((valid, not_valid) => {
        bcrypt_1.default.compare(password, hash).then(function (result) {
            if (result == true)
                return valid(true);
            if (result == false)
                return not_valid(true);
        });
    });
}
exports.comparePassword = comparePassword;
