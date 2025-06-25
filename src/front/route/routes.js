const express = require("express");
const router = express.Router();

const { signupValidation , verifyOtpValidation , forgotPasswordValidation , resetPasswordValidation, loginValidation } = require("../schema/auth");
const {
  signup,
  verifyOtp,
  forgotPassword,
  resetPassword,
  login,
  logout
} = require("../controller/auth"); // ✅ make sure path is correct
const { authenticateUser } = require("../../../middlewares/authJwts");
const { list } = require("../controller/category/category.Controller");

router.post('/signup', signupValidation, signup);
router.post('/verify-otp', verifyOtpValidation, verifyOtp);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);
router.post('/login', loginValidation, login);
router.get('/logout', authenticateUser, logout);
router.get("/category/list", list);
module.exports = router;
