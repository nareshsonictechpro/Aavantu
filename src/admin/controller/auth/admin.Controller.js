
const db = require('../../../../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { failResponse } = require("../../../../helpers/helpers");
require('dotenv').config();
const { Sequelize } = require('sequelize');
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

        console.log(req.params.id);
        try {
            userId = req.params.id;
            const user = await userModal.findAll({
                where: {
                    deletedAt: {
                        [Sequelize.Op.eq]: null
                    }
                },
                paranoid: false
            });
            if (user) {
                return res.send(user)
            } else {
                console.log('User not found');
            }
        } catch (error) {
            console.error('Error during soft delete:', error);
        }
    }
}