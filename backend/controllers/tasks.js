const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, dueDate, priority, assignedTo } = req.body;
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      project: projectId,
      assignedTo: assignedTo || null,
      createdBy: req.user.id,
    });

    const populated = await task.populate('assignedTo', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Members can only update status
    if (req.user.role !== 'admin') {
      const allowedFields = ['status'];
      const updateKeys = Object.keys(updates);
      const isAllowed = updateKeys.every((key) => allowedFields.includes(key));

      if (!isAllowed) {
        return res
          .status(403)
          .json({ message: 'Members can only update task status' });
      }
    }

    const updated = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('assignedTo', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    let projects;

    if (req.user.role === 'admin') {
      projects = await Project.find().select('_id');
    } else {
      projects = await Project.find({
        'members.user': req.user.id,
      }).select('_id');
    }

    const projectIds = projects.map((p) => p._id);
    const now = new Date();

    const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });
    const completedTasks = await Task.countDocuments({
      project: { $in: projectIds },
      status: 'completed',
    });
    const pendingTasks = await Task.countDocuments({
      project: { $in: projectIds },
      status: { $ne: 'completed' },
    });
    const overdueTasks = await Task.countDocuments({
      project: { $in: projectIds },
      status: { $ne: 'completed' },
      dueDate: { $lt: now },
    });

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
