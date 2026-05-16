const users = [
  {
    name: 'Admin',
    email: 'admin@taskflow.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Kaiju Member',
    email: 'kaiju@taskflow.com',
    password: 'admin123',
    role: 'member',
  },
  {
    name: 'Talos Member',
    email: 'talos@taskflow.com',
    password: 'admin123',
    role: 'member',
  },
  {
    name: 'Atlas Member',
    email: 'atlas@taskflow.com',
    password: 'admin123',
    role: 'member',
  },
  {
    name: 'Fenrir Member',
    email: 'fenrir@taskflow.com',
    password: 'admin123',
    role: 'member',
  },
];

const projects = [
  {
    name: 'KAIJU',
    description: 'Technical Projects',
  },
  {
    name: 'TALOS',
    description: 'Technical Projects',
  },
  {
    name: 'ATLAS',
    description: 'Technical Projects',
  },
  {
    name: 'KENSAI',
    description: 'Technical Projects',
  },
  {
    name: 'FENRIR',
    description: 'Technical Projects',
  },
];

module.exports = { users, projects };