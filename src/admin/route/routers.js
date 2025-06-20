const express = require("express");
const router = express.Router();

const { loginValidation } = require("../schema/adminValidation");
const { login, uploadVideo, deleteRecord, getUser } = require("../controller/auth/admin.Controller"); 
const CategoryController = require("../controller/category/category.Controller");
const CourseController = require("../controller/course/course.Controller");

const FaqController = require('../controller/cms/faq.controller');
const CmsController = require('../controller/cms/cms.controller');
const BannerController = require('../controller/banner/banner.controller');

const { authenticateAdmin } = require("../../../middlewares/authJwts");
const multer = require('multer');
const path = require("path");
const fs = require('fs');
const ThumbnailGenerator = require('video-thumbnail-generator').default;


// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/banners/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage })



router.post("/login", loginValidation, login);
router.get("/delete/:id", deleteRecord);
router.get("/getUser", getUser);

router.post('/generatethumbnail', uploadVideo)


// Category 

router.post('/category/create', authenticateAdmin, CategoryController.create);
router.get('/category/list',authenticateAdmin, CategoryController.list);

// Course 
router.post('/course',authenticateAdmin, CourseController.create);
router.get('/course', authenticateAdmin , CourseController.list);

// FAQ Routes
router.post('/faq', FaqController.create);
router.get('/faq', FaqController.list);
router.put('/faq/:id', FaqController.update);
router.delete('/faq/:id', FaqController.delete);

// CMS Page Routes
router.post("/cms/create", CmsController.create);
router.put('/cms/:slug', CmsController.update); // edit
router.get('/cms/all', CmsController.getAll);

// banner 
router.post('/banner', upload.single('image'), authenticateAdmin, BannerController.create);
router.get('/banner', authenticateAdmin, BannerController.list);
router.put('/banner/:id', upload.single('image'), authenticateAdmin, BannerController.update);
router.delete('/banner/:id',authenticateAdmin, BannerController.remove);

module.exports = router;