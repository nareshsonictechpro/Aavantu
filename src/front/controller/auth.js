// controllers/admin/AuthController.js
const db = require('../../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../../../utils/mailer');
const User = db.User;
module.exports = {
  // SIGNUP with OTP generation
  signup: async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    // const otp = Math.floor(100000 + Math.random() * 900000);
    // const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    const otp = 123456

    await User.create({
      first_name,
      last_name,
      email,
      password: hashed,
      otp,
    //   otp_expire_at: otpExpire,
    role: 0, // ✅ explicitly marking this user as "normal user"
    is_verify: 0,
    status:1
    });

    // await sendOtpEmail(email, otp);
    res.status(201).json({ message: "Signup successful, OTP sent" });
  },

  // LOGIN only after verification
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.is_verify === 0) {
      return res.status(403).json({ message: "Email not verified" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    await user.update({ auth_token: token });
    res.json({ message: "Login successful", token });
  },

  // SEND OTP for Forgot Password
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    const otp = 123456

    await user.update({ otp, otp_expire_at: otpExpire });
    // await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent to your email" });
  },

  // VERIFY OTP after Signup or Forgot
  verifyOtp: async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email, otp } });
    if (!user) return res.status(400).json({ message: "Invalid OTP or email" });
    if (new Date() > user.otp_expire_at) return res.status(400).json({ message: "OTP expired" });

    await user.update({ is_verify: 1, otp: null, otp_expire_at: null });
    res.json({ message: "OTP verified successfully" });
  },

  // RESET PASSWORD after OTP verified
  resetPassword: async (req, res) => {
    const { email, otp, password } = req.body;
    const user = await User.findOne({ where: { email, otp } });
    if (!user) return res.status(400).json({ message: "Invalid OTP or email" });
    if (new Date() > user.otp_expire_at) return res.status(400).json({ message: "OTP expired" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({ password: hashedPassword, otp: null, otp_expire_at: null });
    res.json({ message: "Password reset successful" });
  }
};
