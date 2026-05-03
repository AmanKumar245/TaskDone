const express = require('express');
const router = express.Router();
const { getUsers, registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { uploadProfileImages } = require('../middleware/upload');

router.route('/').get(getUsers).post(registerUser);
router.post('/login', loginUser);
router.get('/:id', getUserProfile);
router.put('/profile', protect, uploadProfileImages, updateUserProfile);

module.exports = router;
