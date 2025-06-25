// controllers/admin/AuthController.js
const db = require('../../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../../../utils/mailer');
const User = db.User;
module.exports = {
  // SIGNUP with OTP generation
signup: async (req, res) => {
  try {
    const { first_name, last_name, email, password, confirm_password, category_id } = req.body;
       console.log("BODY RECEIVED >>>", req.body);
    // Check for missing fields
    if (!first_name || !last_name || !email || !password || !confirm_password || !category_id) {
      return res.status(400).json({
        status: false,
        message: "All fields including category_id are required.",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = 123456;

    if (existingUser) {
      if (existingUser.is_verify === 1) {
        return res.status(409).json({
          status: false,
          message: "Email already exists and is already verified.",
        });
      }

      await existingUser.update({
        first_name,
        last_name,
        password: hashedPassword,
        otp,
        is_verify: 0,
        category_id, // ✅ make sure this field exists in DB
      });

      return res.status(200).json({
        status: true,
        message: "Signup updated successfully. OTP re-sent.",
        data: {
          id: existingUser.id,
          email: existingUser.email,
          is_verify: existingUser.is_verify,
        },
      });
    }

    // Create new user
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      otp,
      is_verify: 0,
      status: 1,
      role: 0,
      category_id, // ✅ Save here too
    });

    return res.status(201).json({
      status: true,
      message: "Signup successful. OTP sent.",
      data: {
        id: user.id,
        email: user.email,
        is_verify: user.is_verify,
      },
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}


,

  // LOGIN only after verification
 login: async (req, res) => {
  try {
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

    // Prepare the user data to send (excluding sensitive info)
    const { id, name, email: userEmail, is_verify } = user;

    return res.json({
      message: "Login successful",
      user: {
        id,
        name,
        email: userEmail,
        is_verify,
        auth_token: token
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
}
,

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
  },

  logout: async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized: No token provided",
      });
    }

    // Verify the token to get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and clear the token
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    await user.update({ auth_token: null }); // Clear token from DB

    return res.status(200).json({
      status: true,
      message: "Logout successful",
    });

  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Something went wrong during logout",
      error: error.message,
    });
  }
}

};
