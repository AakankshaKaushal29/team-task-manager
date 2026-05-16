import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsAPI, tasksAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const statusColumns = [
  { key: 'todo', label: 'To Do', color: 'border-yellow-500/50' },
  { key: 'in-progress', label: 'In Progress', color: 'border-blue-500/50' },
  { key: 'completed', label: 'Completed', color: 'border-green-500/50' },
];

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [selectedMember, setSelectedMember] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assignedTo: '',
  });

  const fetchProjectData = useCallback(async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectsAPI.getOne(id),
        tasksAPI.getAll(id),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  useEffect(() => {
    if (isAdmin) {
      authAPI.getUsers().then((res) => setUsers(res.data)).catch(() => {});
    }
  }, [isAdmin]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    setSubmitting(true);
    try {
      const res = await projectsAPI.addMember(id, {
        userId: selectedMember,
        role: 'member',
      });
      setProject(res.data);
      setShowAddMember(false);
      setSelectedMember('');
      toast.success('Member added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      const res = await projectsAPI.removeMember(id, { userId });
      setProject(res.data);
      toast.success('Member removed');
    } catch (err) {
      toast.error('Failed to remove member');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await tasksAPI.create(id, newTask);
      setTasks([res.data, ...tasks]);
      setShowCreateTask(false);
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        assignedTo: '',
      });
      toast.success('Task created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await tasksAPI.update(taskId, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleEditClick = (task) => {
    setEditTask(task);
    setShowEditTask(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await tasksAPI.update(editTask._id, editTask);
      setTasks(tasks.map((t) => (t._id === editTask._id ? res.data : t)));
      setShowEditTask(false);
      setEditTask(null);
      toast.success('Task updated!');
    } catch (err) {
      toast.error('Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksAPI.delete(taskId);
      setTasks(tasks.filter((t) => t._id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const getColumnTasks = (status) =>
    tasks.filter((t) => t.status === status);

  const nonMemberUsers = users.filter(
    (u) =>
      !project?.members?.some((m) => m.user?._id === u._id) &&
      u._id !== project?.owner?._id
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <p className="text-dark-400">Project not found</p>
        <Link to="/projects" className="btn-primary inline-flex mt-4">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="card">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/projects"
              className="p-2 rounded-xl bg-dark-700/50 hover:bg-dark-600 transition-colors"
            >
              <svg
                className="w-5 h-5 text-dark-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {project.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {project.name}
                  </h1>
                  <p className="text-dark-400 text-sm">
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''} ·{' '}
                    {project.members?.length || 0} member
                    {project.members?.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {isAdmin && (
              <>
                <button
                  onClick={() => setShowAddMember(true)}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Add Member
                </button>
                <button
                  onClick={() => setShowCreateTask(true)}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  New Task
                </button>
              </>
            )}
          </div>
        </div>

        {project.description && (
          <p className="text-dark-300 mt-4 ml-16">{project.description}</p>
        )}

        {/* Members Section */}
        {project.members?.length > 0 && (
          <div className="mt-6 pt-6 border-t border-dark-700/30">
            <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">
              Team Members
            </h3>
            <div className="flex flex-wrap gap-3">
              {project.members.map((member) => (
                <div
                  key={member.user?._id || Math.random()}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-700/40 border border-dark-600/50"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {member.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <p className="text-white font-medium leading-tight">
                      {member.user?.name}
                    </p>
                    <p className="text-dark-400 text-[11px] capitalize">
                      {member.role}
                    </p>
                  </div>
                  {isAdmin && member.role !== 'admin' && (
                    <button
                      onClick={() => handleRemoveMember(member.user?._id)}
                      className="ml-1 p-1 text-dark-500 hover:text-red-400 transition-colors"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statusColumns.map((col) => {
          const columnTasks = getColumnTasks(col.key);
          return (
            <div key={col.key} className="min-h-[300px]">
              <div
                className={`flex items-center justify-between mb-3 px-4 py-2 rounded-xl border-l-4 ${col.color} bg-dark-800/40`}
              >
                <h3 className="font-semibold text-white text-sm">
                  {col.label}
                </h3>
                <span className="badge bg-dark-700 text-dark-300 text-xs">
                  {columnTasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {columnTasks.length === 0 ? (
                  <div className="card py-8 text-center">
                    <p className="text-dark-500 text-sm">No tasks</p>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onEdit={isAdmin ? handleEditClick : undefined}
                      onDelete={isAdmin ? handleDeleteTask : undefined}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        title="Add Team Member"
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Select User
            </label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Choose a user...</option>
              {nonMemberUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            {nonMemberUsers.length === 0 && (
              <p className="text-dark-400 text-sm mt-2">
                All users are already members of this project.
              </p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddMember(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || nonMemberUsers.length === 0}
              className="btn-primary flex-1"
            >
              {submitting ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="input-field"
              placeholder="What needs to be done?"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Description
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="input-field resize-none"
              rows={3}
              placeholder="Add details..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Assign To
            </label>
            <select
              value={newTask.assignedTo}
              onChange={(e) =>
                setNewTask({ ...newTask, assignedTo: e.target.value })
              }
              className="input-field"
            >
              <option value="">Unassigned</option>
              {project?.members?.map((m) => (
                <option key={m.user?._id} value={m.user?._id}>
                  {m.user?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateTask(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={showEditTask}
        onClose={() => {
          setShowEditTask(false);
          setEditTask(null);
        }}
        title="Edit Task"
      >
        {editTask && (
          <form onSubmit={handleEditSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Task Title
              </label>
              <input
                type="text"
                value={editTask.title}
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Description
              </label>
              <textarea
                value={editTask.description}
                onChange={(e) =>
                  setEditTask({ ...editTask, description: e.target.value })
                }
                className="input-field resize-none"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Priority
                </label>
                <select
                  value={editTask.priority}
                  onChange={(e) =>
                    setEditTask({ ...editTask, priority: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Status
                </label>
                <select
                  value={editTask.status}
                  onChange={(e) =>
                    setEditTask({ ...editTask, status: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={
                    editTask.dueDate
                      ? new Date(editTask.dueDate)
                          .toISOString()
                          .split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    setEditTask({ ...editTask, dueDate: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Assign To
                </label>
                <select
                  value={editTask.assignedTo?._id || editTask.assignedTo || ''}
                  onChange={(e) =>
                    setEditTask({ ...editTask, assignedTo: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="">Unassigned</option>
                  {project?.members?.map((m) => (
                    <option key={m.user?._id} value={m.user?._id}>
                      {m.user?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowEditTask(false);
                  setEditTask(null);
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex-1"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ProjectDetail;
