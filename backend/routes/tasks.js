const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getDashboardStats,
} = require('../controllers/tasks');
const { protect } = require('../middleware/auth');
const { isAdmin, isProjectMember } = require('../middleware/roles');

router.use(protect);

router.get('/dashboard/stats', getDashboardStats);

router
  .route('/project/:projectId')
  .post(
    isAdmin,
    [body('title').trim().notEmpty().withMessage('Task title is required')],
    createTask
  )
  .get(isProjectMember, getTasks);

router
  .route('/:id')
  .put(updateTask)
  .delete(isAdmin, deleteTask);

module.exports = router;
