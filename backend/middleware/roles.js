const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admin only.' });
};

const isProjectAdmin = async (req, res, next) => {
  try {
    const Project = require('../models/Project');
    const projectId = req.params.id || req.params.projectId;

    if (req.user.role === 'admin') return next();

    if (projectId) {
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const member = project.members.find(
        (m) => m.user.toString() === req.user.id && m.role === 'admin'
      );

      if (member || project.owner.toString() === req.user.id) {
        return next();
      }
    }

    return res
      .status(403)
      .json({ message: 'Access denied. Project admin only.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const isProjectMember = async (req, res, next) => {
  try {
    const Project = require('../models/Project');
    const projectId = req.params.id || req.params.projectId;

    if (req.user.role === 'admin') return next();

    if (projectId) {
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const isMember = project.members.some(
        (m) => m.user.toString() === req.user.id
      );

      if (isMember || project.owner.toString() === req.user.id) {
        return next();
      }
    }

    return res
      .status(403)
      .json({ message: 'Access denied. Not a project member.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { isAdmin, isProjectAdmin, isProjectMember };
