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

 update: async (req, res) => {
  try {
    const { name, category_id, videos } = req.body;
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    await course.update({ name, category_id });

    if (Array.isArray(videos)) {
      await CourseVideo.destroy({ where: { course_id: id } });
      const videoRecords = videos.map((url) => ({
        course_id: id,
        video_url: url,
      }));
      await CourseVideo.bulkCreate(videoRecords);
    }

    return res.status(200).json({ message: "Course updated successfully", course });

  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({ message: "Error updating course", error: error.message });
  }
}

,
  // Get All Courses (Optional filter by category)
list: async (req, res) => {
  try {
    const { limit = 10, page = 1, search = "" } = req.body;
    const offset = (page - 1) * limit;

    const whereCondition = search
      ? {
          name: {
            [Op.iLike]: `%${search}%`, // case-insensitive
          },
        }
      : {};

    // Get total count of matching categories (optional if not paginating on course level)
    const totalCount = await Course.count({
      include: [
        {
          model: Category,
          where: whereCondition,
        },
      ],
    });

    const courses = await Course.findAll({
      include: [
        {
          model: Category,
          where: whereCondition,
          attributes: ['id', 'name'],
        },
        {
          model: CourseVideo,
          as: 'videos',
          attributes: ['id', 'video_url'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    // Flatten course list with category data
    const flatCourses = courses.map((course) => ({
      ...course.toJSON(),
      category_id: course.Category?.id || null,
      category_name: course.Category?.name || null,
    }));

    return res.status(200).json({
      status: true,
      message: "Courses fetched successfully.",
      data: flatCourses,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
}


};
