// utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});

exports.sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Your OTP for Password Reset',
    text: `Your OTP is: ${otp}`
  };

  await transporter.sendMail(mailOptions);
};
