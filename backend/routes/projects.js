const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProject,
  addMember,
  removeMember,
  deleteProject,
} = require('../controllers/projects');
const { protect } = require('../middleware/auth');
const { isAdmin, isProjectMember } = require('../middleware/roles');

router.use(protect);

router
  .route('/')
  .post(
    isAdmin,
    [body('name').trim().notEmpty().withMessage('Project name is required')],
    createProject
  )
  .get(getProjects);

router
  .route('/:id')
  .get(isProjectMember, getProject)
  .delete(isAdmin, deleteProject);

router
  .route('/:id/members')
  .post(
    isAdmin,
    [body('userId').notEmpty().withMessage('User ID is required')],
    addMember
  )
  .delete(
    isAdmin,
    [body('userId').notEmpty().withMessage('User ID is required')],
    removeMember
  );

module.exports = router;
