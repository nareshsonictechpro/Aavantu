const db = require('../../../../models');
const CMSPage = db.CMSPage

module.exports = { 

 create: async (req, res) => {
    try {
      const { title, content, slug } = req.body;

      // Validation check
      if (!title || !content || !slug) {
        return res.status(400).json({ message: "Title, content, and slug are required" });
      }

      // Check if slug already exists
      const existing = await CMSPage.findOne({ where: { slug } });
      if (existing) {
        return res.status(409).json({ message: "Page with this slug already exists" });
      }

      // Create new CMS page
      const page = await CMSPage.create({ title, content, slug });

      res.status(201).json({ message: "CMS page created", page });
    } catch (error) {
      console.error("CMS Create Error:", error);
      res.status(500).json({ message: "Failed to create CMS page", error: error.message });
    }
  },



  update: async (req, res) => {
    const { slug } = req.params;
    const { title, content } = req.body;
    const page = await CMSPage.findOne({ where: { slug } });
    if (!page) return res.status(404).json({ message: "Page not found" });
    await page.update({ title, content });
    res.json({ message: "Page updated", page });
  },

 getAll: async (req, res) => {
  try {
    const pages = await CMSPage.findAll(); // fetch all CMS records
    res.json({ pages });
  } catch (err) {
    console.error("Error fetching CMS pages:", err);
    res.status(500).json({ message: "Failed to fetch CMS pages" });
  }
},
};
