'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CourseVideo extends Model {
    static associate(models) {
     CourseVideo.belongsTo(models.Course, { foreignKey: 'course_id' });
    }
  }

  CourseVideo.init({
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    video_url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'CourseVideo',
    timestamps: true,
  });

  return CourseVideo;
};
