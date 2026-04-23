const express = require('express');
const router = express.Router();
const { 
    createTask, 
    getTasks, 
    getTaskById, 
    addOfferToTask, 
    addQuestionToTask,
    getMyTasks,
    acceptOffer,
    replyToOffer,
    replyToQuestion
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getTasks).post(protect, createTask);
router.route('/myTasks').get(protect, getMyTasks);
router.route('/:id').get(getTaskById);
router.route('/:id/offers').post(protect, addOfferToTask);
router.route('/:id/questions').post(protect, addQuestionToTask);
router.route('/:id/offers/:offerId/accept').patch(protect, acceptOffer);
router.route('/:id/offers/:offerId/reply').post(protect, replyToOffer);
router.route('/:id/questions/:questionId/reply').post(protect, replyToQuestion);

module.exports = router;
