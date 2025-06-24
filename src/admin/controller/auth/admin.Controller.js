
const db = require('../../../../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { failResponse } = require("../../../../helpers/helpers");
require('dotenv').config();
const {Op, Sequelize } = require('sequelize');
const SALTROUNDS = process.env.SALTROUNDS;
secretToken = "12345";
expirationTime = 10;
const userModal = db.User;
module.exports = {

    login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    try {
      // Find user by email
      const user = await userModal.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generate token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      // const token = jwt.sign({ userId: user.id }, secretToken, { expiresIn: expirationTime });

      // Update user's login status and auth token
      await user.update({
        is_login: 1,
        auth_token: token,
        online: 1
      });

      // Get plain object without password
      const userData = user.toJSON();
      delete userData.password;

      return res.status(200).json({
        message: "Login successful",
        token,
        user: userData
      });

    } catch (err) {
      return res.status(500).json({ message: "Server error", details: err.message });
    }
  }
,
logout: async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user
    const user = await userModal.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update login status
    await user.update({
      is_login: 0,
      auth_token: null,
      online: 0
    });

    return res.status(200).json({ message: "Logout successful" });

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token", details: err.message });
  }
}
,
forgotPassword: async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required!" });
  }

  try {
    const user = await userModal.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = 123456
    // const otp = Math.floor(100000 + Math.random() * 900000);
    // const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await user.update({ otp});

    // Send OTP via email (use nodemailer or any email service here)
    console.log(`OTP for ${email}: ${otp}`); // For dev/testing

    return res.status(200).json({ message: "OTP sent to email" });

  } catch (err) {
    return res.status(500).json({ message: "Server error", details: err.message });
  }
},
resetPassword: async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await userModal.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      user.otp !== parseInt(otp) ||
      new Date(user.otp_expires) < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashedPassword,
      otp: null,
      // otp_expires: null,
    });

    return res.status(200).json({ message: "Password reset successful" });

  } catch (err) {
    return res.status(500).json({ message: "Server error", details: err.message });
  }
}
,
changePassword: async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Both old and new password required" });
  }

  try {
    const user = await userModal.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({ password: hashedPassword });

    return res.status(200).json({ message: "Password changed successfully" });

  } catch (err) {
    return res.status(500).json({ message: "Server error", details: err.message });
  }
}
,
verifyOtp: async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await userModal.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    return res.status(200).json({ message: "OTP verified successfully" });

  } catch (err) {
    return res.status(500).json({ message: "Server error", details: err.message });
  }
}
,
resendOtp: async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await userModal.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new 6-digit OTP
    // const otp = Math.floor(100000 + Math.random() * 900000);
const otp = 123456
    // Update the OTP in the user table
    await user.update({ otp });

    // Send OTP via email (add actual email logic here)
    console.log(`Resent OTP for ${email}: ${otp}`); // For testing only

    return res.status(200).json({ message: "OTP resent successfully" });

  } catch (err) {
    return res.status(500).json({ message: "Server error", details: err.message });
  }
}
,

    uploadVideo: (req, res) => {

    },


    deleteRecord: async (req, res) => {

        console.log(req.params.id);
        try {
            userId = req.params.id;
            const user = await userModal.findByPk(userId);
            if (user) {
                await user.destroy();
                console.log('User soft deleted');
            } else {
                console.log('User not found');
            }
        } catch (error) {
            console.error('Error during soft delete:', error);
        }
    },


    getUser: async (req, res) => {

  try {
    const {
      name = '',
      email = '',
      phone = '',
      page = 1,
      pageSize = 10,
    } = req.body; // ✅ Expecting POST body

    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    const whereClause = {
      deletedAt: { [Op.eq]: null },
      role: { [Op.ne]: 1 }, // ✅ Exclude users with role 1 (Admin)
    };

    if (name) {
      whereClause.first_name = { [Op.like]: `%${name}%` };
    }
    if (email) {
      whereClause.email = { [Op.like]: `%${email}%` };
    }
    if (phone) {
      whereClause.phone = { [Op.like]: `%${phone}%` };
    }

    const { rows: users, count: totalcount } = await userModal.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      paranoid: false,
    });

    return res.status(200).json({
      status: true,
      message: 'User list fetched successfully',
      data: {
        list: users,
        totalcount,
        page: parseInt(page),
        perpage_count: limit,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
    },


updateUserStatus: async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: 'User ID is required',
      });
    }

    const user = await userModal.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    const newStatus = user.status === 1 ? 0 : 1;

    await user.update({ status: newStatus });

    return res.status(200).json({
      status: true,
      message: `User status updated to ${newStatus === 1 ? 'Active' : 'Inactive'}`,
      data: { status: newStatus }
    });

  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
}

}