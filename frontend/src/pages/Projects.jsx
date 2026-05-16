import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'KAIJU',
      member: 'Riya Kapoor',
      task: 'AI Optimization Module',
      status: 'In Progress',
    },
    {
      id: 2,
      name: 'TALOS',
      member: 'Arjun Mehta',
      task: 'Security Audit',
      status: 'Pending',
    },
    {
      id: 3,
      name: 'ATLAS',
      member: 'Neha Sharma',
      task: 'Dashboard Analytics',
      status: 'Completed',
    },
    {
      id: 4,
      name: 'KENSAI',
      member: 'Kabir Singh',
      task: 'Task Assignment API',
      status: 'In Progress',
    },
    {
      id: 5,
      name: 'FENRIR',
      member: 'Aman Verma',
      task: 'Frontend UI Testing',
      status: 'Pending',
    },
  ]);

  const addMember = () => {
    alert('Member Added Successfully');
  };

  const removeMember = () => {
    alert('Member Removed Successfully');
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            Technical Projects
          </h1>

          <p className="text-dark-400 mt-2">
            Manage projects and assigned tasks
          </p>
        </div>

        {user?.role === 'admin' && (
          <div className="flex gap-4">
            <button
              onClick={addMember}
              className="bg-primary-600 hover:bg-primary-700 px-5 py-3 rounded-xl"
            >
              Add Member
            </button>

            <button
              onClick={removeMember}
              className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl"
            >
              Remove Member
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-3">
              {project.name}
            </h2>

            <div className="space-y-3">
              <p className="text-dark-300">
                <span className="font-semibold text-white">
                  Assigned To:
                </span>{' '}
                {project.member}
              </p>

              <p className="text-dark-300">
                <span className="font-semibold text-white">
                  Task:
                </span>{' '}
                {project.task}
              </p>

              <p className="text-dark-300">
                <span className="font-semibold text-white">
                  Status:
                </span>{' '}
                {project.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;