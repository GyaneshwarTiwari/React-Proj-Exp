const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllRead, deleteNotification, deleteAllNotifications } = require('../controllers/notificationController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, getNotifications);
router.patch('/read/:id', authMiddleware, markAsRead);
router.patch('/read-all', authMiddleware, markAllRead);
router.delete('/:id', authMiddleware, deleteNotification);
router.delete('/', authMiddleware, deleteAllNotifications);

module.exports = router;
