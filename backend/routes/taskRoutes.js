const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const taskValidation = [
  body('title').trim().isLength({ min: 1, max: 120 }).withMessage('Title must be 1–120 characters.'),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status value.'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority value.'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date format.'),
];

// All task routes are protected
router.use(protect);

router.get('/stats', getStats);
router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', taskValidation, createTask);
router.put('/:id', taskValidation, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
