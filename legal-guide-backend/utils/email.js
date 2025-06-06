const nodemailer = require("nodemailer");

/** mailtrap.io -руу имэйл илгээх */
const sendEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.SMTP_FROM} <${process.env.SMTP_FROM_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    html: options.message, // html body
  });

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  return info;
};
module.exports = sendEmail;
