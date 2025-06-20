'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
   static associate(models) {
  Course.belongsTo(models.Category, { foreignKey: 'category_id' });
  Course.hasMany(models.CourseVideo, { foreignKey: 'course_id' , as: 'videos' });

  
}

 }

  Course.init({
    name: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // videos: {
    //   type: DataTypes.JSON,  // Allows storing an array of video links
    //   allowNull: true
    // }
  }, {
    sequelize,
    modelName: 'Course',
    timestamps: true,
    // paranoid: true, // Uncomment if you want soft deletes
    // deletedAt: 'deletedAt'
  });

  return Course;
};
