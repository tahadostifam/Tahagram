import nodemailer from "nodemailer";
import fs from "fs";
const mail_configs = require("../configs/mail.json");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: mail_configs.gmail,
        pass: mail_configs.password,
    },
});

export function sendMail(template_name: string, to: string, subject: string) {
    return new Promise<void>((resolve, reject) => {
        const html = fs.exists(`${process.cwd()}/mail/${template_name}`, (files_exists) => {
            if (files_exists) {
                const mail = transporter
                    .sendMail({
                        from: "Tahagram's Service",
                        to: to,
                        subject: subject,
                        html: "",
                    })
                    .then(() => {
                        resolve();
                    })
                    .catch(() => {
                        reject();
                    });
            } else {
                reject();
            }
        });
    });
}
