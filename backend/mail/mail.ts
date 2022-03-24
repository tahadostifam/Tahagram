import nodemailer from "nodemailer";
import fs from "fs";
import ejs from "ejs";
const mail_configs = require("../configs/mail.json");

const templates_directory = `${process.cwd()}/mail`;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: mail_configs.gmail,
        pass: mail_configs.password,
    },
});

export function sendMail(template_name: string, data: any, to: string, subject: string) {
    return new Promise<void>((resolve, reject) => {
        ejs.renderFile(`${templates_directory}/${template_name}.ejs`, data, (err, str) => {
            if (err) {
                reject();
                return console.error(`An error occurred on reading ${template_name} mail template`);
            }
            const mail = transporter
                .sendMail({
                    from: "Tahagram's Service",
                    to: to,
                    subject: subject,
                    html: str,
                })
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    console.log("Error: " + err);

                    reject();
                });
        });
    });
}

sendMail("verific", {}, "mr.tahadostifam@gmail.com", "Logging In Account")
    .then(() => {
        console.log("email sended");
    })
    .catch(() => {
        console.log("Error in sending the email!");
    });
