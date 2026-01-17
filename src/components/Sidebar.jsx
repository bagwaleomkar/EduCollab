import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardIcon,
  GroupIcon,
  TaskIcon,
  NotesIcon,
  AIIcon,
  ProgressIcon,
  SettingsIcon,
} from './common/Icons';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
    { id: 'groups', label: 'My Study Groups', icon: GroupIcon, path: '/groups' },
    { id: 'tasks', label: 'Tasks / Planner', icon: TaskIcon, path: '/tasks' },
    { id: 'notes', label: 'Notes & Resources', icon: NotesIcon, path: '/notes' },
    { id: 'ai', label: 'AI Assistant', icon: AIIcon, path: '/ai-assistant' },
    { id: 'progress', label: 'Progress', icon: ProgressIcon, path: '/progress' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/settings' },
  ];

  const handleNavigation = (path) => {
    if (path === '/dashboard' || path === '/groups' || path === '/tasks' || path === '/notes' || path === '/progress' || path === '/settings') {
      navigate(path);
    } else {
      // For other routes, you can implement navigation later
      alert(`Navigation to ${path} - Coming soon!`);
    }
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200 
          w-64 transition-transform duration-300 z-50 lg:z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header - Only visible on mobile */}
          <div className="lg:hidden p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                        transition-colors duration-200 text-left
                        ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-primary-900 mb-1">
                Need Help?
              </h3>
              <p className="text-xs text-primary-700 mb-3">
                Check out our guides and tutorials
              </p>
              <button className="w-full bg-primary-600 text-white text-sm py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
