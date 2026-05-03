const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// Single avatar upload
const uploadAvatar = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('avatar');

// Multiple portfolio images (up to 10)
const uploadPortfolio = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).array('portfolio', 10);

// Combined upload for profile update (avatar + portfolio)
const uploadProfileImages = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'portfolio', maxCount: 10 },
]);

module.exports = { uploadAvatar, uploadPortfolio, uploadProfileImages };
