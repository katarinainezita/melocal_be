import nodemailer from "nodemailer";

export const MelocalMail = async (req, res, data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  })

  const mailer = transporter.sendMail({
    from: process.env.MAIL_SENDER_NAME,
    to: data.email, 
    subject: data.subject,
    text: data.text,
  })

  if (mailer) {
    return true
  } else {
    return false
  }
}