const express = require('express');
const router = express.Router();
const { 
    createTask, 
    getTasks, 
    getTaskById, 
    addOfferToTask, 
    addQuestionToTask,
    getMyTasks,
    getAssignedTasks,
    acceptOffer,
    markTaskComplete,
    releasePayment,
    replyToOffer,
    replyToQuestion,
    addReview
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getTasks).post(protect, createTask);
router.route('/myTasks').get(protect, getMyTasks);
router.route('/assignedToMe').get(protect, getAssignedTasks);
router.route('/:id').get(getTaskById);
router.route('/:id/offers').post(protect, addOfferToTask);
router.route('/:id/questions').post(protect, addQuestionToTask);
router.route('/:id/offers/:offerId/accept').patch(protect, acceptOffer);
router.route('/:id/offers/:offerId/reply').post(protect, replyToOffer);
router.route('/:id/questions/:questionId/reply').post(protect, replyToQuestion);
router.route('/:id/complete').patch(protect, markTaskComplete);
router.route('/:id/release-payment').patch(protect, releasePayment);
router.route('/:id/review').post(protect, addReview);

module.exports = router;

