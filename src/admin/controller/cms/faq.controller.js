// controllers/admin/FaqController.js
const db = require('../../../../models');
const FAQ = db.FAQ

module.exports = {
  create: async (req, res) => {
    const { question, answer } = req.body;
    const faq = await FAQ.create({ question, answer });
    res.json({ message: "FAQ added", faq });
  },

  list: async (req, res) => {
    const faqs = await FAQ.findAll();
    res.json({ faqs });
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;
    const faq = await FAQ.findByPk(id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    await faq.update({ question, answer });
    res.json({ message: "FAQ updated", faq });
  },

  delete: async (req, res) => {
    const { id } = req.params;
    const faq = await FAQ.findByPk(id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    await faq.destroy();
    res.json({ message: "FAQ deleted" });
  },
};
