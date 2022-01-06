import bcrypt from "bcrypt";

const saltRounds = 12;

export function makeHashPassword(password: string) {
    return new Promise((success, error) => {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return error();
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) return error();
                success(hash);
            });
        });
    });
}

export function comparePassword(password: string, hash: string) {
    return new Promise((valid, not_valid) => {
        bcrypt.compare(password, hash).then(function (result) {
            if (result == true) return valid(true);
            if (result == false) return not_valid(true);
        });
    });
}
