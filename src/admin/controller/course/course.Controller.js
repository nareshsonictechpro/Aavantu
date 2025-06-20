const db = require('../../../../models');
const Course = db.Course;
const Category = db.Category;
const CourseVideo = db.CourseVideo;
module.exports = {
  // Create Course
 create : async (req, res) => {
  try {
    const { name, category_id, videos } = req.body;

    const course = await Course.create({ name, category_id });

    if (Array.isArray(videos)) {
      const videoRecords = videos.map(url => ({
        course_id: course.id,
        video_url: url
      }));

      console.log("Prepared video records:", videoRecords); // ✅ Debug log

      await CourseVideo.bulkCreate(videoRecords);
    } else {
      console.log("Videos is not an array or empty");
    }

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }},

  // Get All Courses (Optional filter by category)
  list: async (req, res) => {
    try {
      const categories = await Category.findAll({
        include: [
          {
            model: Course,
            include: [
              {
                model: CourseVideo,
                as: 'videos',
                attributes: ['id', 'video_url']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json({ status: true, categories });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ status: false, message: "Internal Server Error", error: err.message });
    }
  }
  
};
