import { checkUsernameUniqueness } from "../controllers/users_controller";
import User from "../models/user";
import { connect } from "../lib/database";

console.clear();

async function main() {
    connect();

    checkUsernameUniqueness("taha").then(
        () => {
            console.log("yes");
        },
        () => {
            console.log("no");
        }
    );
}

main();
