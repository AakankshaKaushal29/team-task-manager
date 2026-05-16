import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tasksAPI, projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const statCards = [
  {
    key: 'totalTasks',
    label: 'Total Tasks',
    color: 'from-blue-500 to-cyan-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    key: 'completedTasks',
    label: 'Completed',
    color: 'from-green-500 to-emerald-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'pendingTasks',
    label: 'Pending',
    color: 'from-orange-500 to-yellow-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'overdueTasks',
    label: 'Overdue',
    color: 'from-red-500 to-rose-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, projectsRes] = await Promise.all([
          tasksAPI.getDashboardStats(),
          projectsAPI.getAll(),
        ]);
        setStats(statsRes.data);
        setProjects(projectsRes.data);
      } catch (err) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Skeleton header */}
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-dark-700/50 rounded-lg mb-2"></div>
          <div className="h-4 w-48 bg-dark-700/30 rounded-lg"></div>
        </div>
        {/* Skeleton stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="w-10 h-10 bg-dark-700/50 rounded-xl mb-3"></div>
              <div className="h-7 w-16 bg-dark-700/50 rounded-lg mb-2"></div>
              <div className="h-4 w-20 bg-dark-700/30 rounded-lg"></div>
            </div>
          ))}
        </div>
        {/* Skeleton projects */}
        <div className="animate-pulse">
          <div className="h-6 w-40 bg-dark-700/50 rounded-lg mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-dark-700/50 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-dark-700/50 rounded-lg mb-2"></div>
                    <div className="h-3 w-20 bg-dark-700/30 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-dark-400 mt-1">
          Here&apos;s what&apos;s happening with your projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.key} className="card glass-hover relative overflow-hidden group">
            {/* Background glow */}
            <div className={`absolute -top-6 -right-6 w-32 h-32 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${card.color} rounded-full blur-3xl`} />
            <div className="relative z-10">
              <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${card.color} mb-3 shadow-lg`}>
                {card.icon}
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {stats?.[card.key] ?? 0}
              </p>
              <p className="text-dark-400 text-sm">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Projects Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
          <Link
            to="/projects"
            className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
          >
            View all
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-700/50 flex items-center justify-center">
              <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-dark-400">No projects yet</p>
            {user?.role === 'admin' && (
              <Link
                to="/projects"
                className="btn-primary inline-flex mt-4 text-sm"
              >
                Create your first project
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="card glass-hover group block"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {project.name}
                    </h3>
                    <p className="text-dark-400 text-xs">
                      {project.members?.length || 0} members
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-dark-500 group-hover:text-primary-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                {project.description && (
                  <p className="text-dark-400 text-sm line-clamp-2">
                    {project.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
