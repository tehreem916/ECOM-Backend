const nodemailer = require("nodemailer");

module.exports = async ({ email, subject, message }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: Number(process.env.SMPT_PORT || 587),
        service: process.env.SMPT_SERVICE,
        auth: { user: process.env.SMPT_MAIL, pass: process.env.SMPT_PASSWORD }
    });
    await transporter.sendMail({ from: process.env.SMPT_MAIL, to: email, subject, text: message });
};
