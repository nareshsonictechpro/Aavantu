const db = require('../../../../models');
const Banner = db.Banner;

module.exports = {
  create: async (req, res) => {
   try {
    const { title } = req.body;
    const image = req.file?.filename;

    if (!title || !image) {
      return res.status(400).json({ message: 'Title and image are required' });
    }

    const banner = await Banner.create({ title, image });

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/banners/${image}`;

    res.status(201).json({
      status: true,
      message: 'Banner created successfully',
      data: {
        id: banner.id,
        title: banner.title,
        image: banner.image,
        imageUrl
      }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error creating banner',
      error: error.message
    });
  }
  },

  list: async (req, res) => {
    try {
      const banners = await Banner.findAll();
      res.json({ banners });
    } catch (error) {
      res.status(500).json({ message: 'Error listing banners', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, status } = req.body;
      const image = req.file?.filename;

      const banner = await Banner.findByPk(id);
      if (!banner) return res.status(404).json({ message: 'Banner not found' });

      await banner.update({
        title: title || banner.title,
        image: image || banner.image,
        status: status ?? banner.status
      });

      res.json({ message: 'Banner updated', banner });
    } catch (error) {
      res.status(500).json({ message: 'Error updating banner', error: error.message });
    }
  },

  remove: async (req, res) => {
    try {
      const { id } = req.params;
      const banner = await Banner.findByPk(id);
      if (!banner) return res.status(404).json({ message: 'Banner not found' });

      await banner.destroy();
      res.json({ message: 'Banner deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting banner', error: error.message });
    }
  }
};
