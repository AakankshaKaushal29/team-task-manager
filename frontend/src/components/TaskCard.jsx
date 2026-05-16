import { useAuth } from '../context/AuthContext';

const priorityColors = {
  low: 'badge-low',
  medium: 'badge-medium',
  high: 'badge-high',
};

const statusColors = {
  todo: 'badge-todo',
  'in-progress': 'badge-in-progress',
  completed: 'badge-completed',
};

const TaskCard = ({ task, onStatusChange, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isMember = user?.role === 'member';

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'completed';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card glass-hover group cursor-pointer relative overflow-hidden">
      {/* Left accent strip */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          task.priority === 'high'
            ? 'bg-red-500'
            : task.priority === 'medium'
            ? 'bg-orange-500'
            : 'bg-gray-500'
        }`}
      />

      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-semibold text-white text-sm leading-tight line-clamp-2"
            onClick={() => onEdit?.(task)}
          >
            {task.title}
          </h3>
          <span className={priorityColors[task.priority] || 'badge-low'}>
            {task.priority}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-dark-400 text-xs line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-dark-700/30">
          <div className="flex items-center gap-2">
            {/* Assignee */}
            {task.assignedTo && (
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-[9px] font-bold text-white">
                  {task.assignedTo.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-dark-400 text-[11px]">
                  {task.assignedTo.name?.split(' ')[0]}
                </span>
              </div>
            )}

            {/* Due date */}
            {task.dueDate && (
              <span
                className={`text-[11px] ${
                  isOverdue ? 'text-red-400' : 'text-dark-400'
                }`}
              >
                {isOverdue && '⚠ '}
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {isMember ? (
              <select
                value={task.status}
                onChange={(e) => onStatusChange?.(task._id, e.target.value)}
                className={`text-[11px] px-2 py-1 rounded-lg border border-dark-600 bg-dark-800 text-dark-200 cursor-pointer focus:outline-none focus:border-primary-500`}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Done</option>
              </select>
            ) : (
              <span className={statusColors[task.status]}>
                {task.status}
              </span>
            )}

            {!isMember && (
              <button
                onClick={() => onDelete?.(task._id)}
                className="p-1 text-dark-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
                title="Delete task"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
