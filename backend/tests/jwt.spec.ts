import "mocha";

import { compareToken, generateToken } from "../lib/jwt";

describe("Desc", () => {
    generateToken("taha").then(
        (token) => {
            console.log(token);
        },
        () => {
            console.error("Error in generating token with jwt!");
        }
    );

    const exam_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRhaGFkIiwiaWF0IjoxNjQ3NjI1NjcwLCJleHAiOjE2NDg0ODk2NzB9.3cLhTkfKFjmMvpf1H7te-BZcH3_8wXJhhtOjx0DfnBs";
    compareToken(exam_token).then(
        () => {
            console.log("\nvalid token");
        },
        () => {
            console.error("\nbad token");
        }
    );
});
