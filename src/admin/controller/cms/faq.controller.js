const db = require('../../../../models');
const FAQ = db.FAQ;
const { Op } = require("sequelize");

module.exports = {
  // ➕ Create FAQ
  create: async (req, res) => {
    try {
      const { question, answer } = req.body;

      if (!question || !answer) {
        return res.status(400).json({
          status: false,
          message: "Question and Answer are required",
        });
      }

      const faq = await FAQ.create({ question, answer });
      res.status(201).json({ status: true, message: "FAQ added", faq });
    } catch (error) {
      console.error("Create FAQ Error:", error);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  },

  // 📄 List FAQs with pagination & search
  list: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "" } = req.body;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const whereClause = {};

      if (search) {
        whereClause.question = { [Op.like]: `%${search}%` };
      }

      const { rows: faqs, count: totalcount } = await FAQ.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset,
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        status: true,
        message: "FAQ list fetched successfully",
        data: {
          list: faqs,
          totalcount,
          page: parseInt(page),
          perpage_count: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("FAQ List Error:", error);
      res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  },

  // ✏️ Update FAQ
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { question, answer } = req.body;

      if (!question || !answer) {
        return res.status(400).json({
          status: false,
          message: "Question and Answer are required for update",
        });
      }

      const faq = await FAQ.findByPk(id);
      if (!faq) {
        return res.status(404).json({ status: false, message: "FAQ not found" });
      }

      await faq.update({ question, answer });
      res.json({ status: true, message: "FAQ updated", faq });
    } catch (error) {
      console.error("FAQ Update Error:", error);
      res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  },

  // ❌ Delete FAQ
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const faq = await FAQ.findByPk(id);
      if (!faq) {
        return res.status(404).json({ status: false, message: "FAQ not found" });
      }

      await faq.destroy();
      res.json({ status: true, message: "FAQ deleted" });
    } catch (error) {
      console.error("FAQ Delete Error:", error);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  },
};
