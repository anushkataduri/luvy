const express = require('express');
const multer = require('multer');

const router = express.Router();

const {
  testAuth,
  signupUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
} = require('../controllers/authController');

// multer storage setup for profile photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.get('/test', testAuth);
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/profile/:id', getProfile);
router.put('/profile/:id', upload.single('profile_photo'), updateProfile);
router.post('/change-password/:id', changePassword);

module.exports = router;