import nodemailer from "nodemailer";
import fs from "fs";
import ejs from "ejs";
const mail_configs = require("../configs/mail.json");

const templates_directory = `${process.cwd()}/mail`;
let templates: any = {};

async function readAndSetTemplates() {
    return new Promise<void>((resolve, reject) => {
        const templates_list = [{ filename: "verific", data: {} }];
        templates_list.forEach(async (item, index) => {
            const file_addr = `${templates_directory}/${item.filename}.ejs`;
            await fs.readFile(file_addr, async (err, data) => {
                if (err) {
                    reject();
                    return console.error(`An error occurred on reading ${item.filename} mail template`);
                }
                const rendered_template = await ejs.render(data.toString("utf-8"), item.data, { async: true });
                console.log(rendered_template);
                templates["hello"] = "world";

                // templates[item.filename] = rendered_template;
            });
            if (index == templates_list.length - 1) {
                resolve();
            }
        });
    });
}

readAndSetTemplates().then(() => {
    console.log(templates);
});

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
