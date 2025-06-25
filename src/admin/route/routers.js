const express = require("express");
const router = express.Router();

const { loginValidation } = require("../schema/adminValidation");
const { login, uploadVideo, deleteRecord, getUser, updateUserStatus, logout, forgotPassword, changePassword, resetPassword, verifyOtp, resendOtp } = require("../controller/auth/admin.Controller"); 
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
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });




router.post("/login", loginValidation, login);
router.get('/logout', logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

router.post("/change-password", authenticateAdmin, changePassword);
router.post("/reset-password", resetPassword);

router.get("/delete/:id", deleteRecord);
router.post("/getUser",authenticateAdmin, getUser);
router.post('/updateUserStatus', authenticateAdmin, updateUserStatus);
router.post('/generatethumbnail', uploadVideo)


// Category 

router.post("/category/create", upload.single("image"),authenticateAdmin, CategoryController.create);
router.put("/category/:id", upload.single("image"),authenticateAdmin, CategoryController.update);
router.get("/category/list",authenticateAdmin, CategoryController.list);
// Course 
router.post('/course',authenticateAdmin, CourseController.create);
router.post("/course/list",authenticateAdmin, CourseController.list);
router.put("/course/update/:id",authenticateAdmin, CourseController.update);
// FAQ Routes
router.post('/faq', FaqController.create);
router.post('/faq/list', FaqController.list);
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