import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Card, Button, StatCard, Badge } from './common/UIComponents';
import {
  GroupIcon,
  TaskIcon,
  ClockIcon,
  UsersIcon,
  PlusIcon,
  CheckIcon,
  MenuIcon,
} from './common/Icons';
import { useAuth } from '../contexts/AuthContext';
import { groupAPI, taskAPI } from '../services/apiService';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        setError(null);

        const [groupsData, tasksData] = await Promise.all([
          groupAPI.getUserGroups(currentUser.uid),
          taskAPI.getUserTasks(currentUser.uid),
        ]);

        setGroups(groupsData || []);
        setTasks(tasksData || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  // Calculate stats from real data
  const stats = {
    joinedGroups: groups.length,
    pendingTasks: tasks.filter(t => t.status !== 'completed').length,
    studyHours: 0, // Could be calculated from task completion times
  };

  // Get today's tasks
  const todayTasks = tasks.filter(task => {
    if (task.status === 'completed') return false;
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  }).slice(0, 6);

  // Get upcoming deadlines
  const upcomingDeadlines = tasks
    .filter(t => t.status !== 'completed' && new Date(t.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const toggleTaskStatus = async (taskId) => {
    try {
      const updatedTask = await taskAPI.toggleTask(taskId);
      setTasks(tasks.map(task =>
        task._id === taskId ? updatedTask : task
      ));
    } catch (err) {
      console.error('Error toggling task:', err);
      alert('Failed to update task status');
    }
  };

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <main className="flex-1 lg:ml-64 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          {/* Mobile Menu Button */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <MenuIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="p-6 lg:p-8">
            {/* Welcome Section */}
            <Card className="mb-6 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, <span className="capitalize">{userName}</span> 👋
                  </h1>
                  <p className="text-gray-600">{getCurrentDate()}</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <StatCard
                  title="Joined Groups"
                  value={stats.joinedGroups}
                  icon={<GroupIcon className="w-6 h-6" />}
                  color="blue"
                />
                <StatCard
                  title="Pending Tasks"
                  value={stats.pendingTasks}
                  icon={<TaskIcon className="w-6 h-6" />}
                  color="orange"
                />
                <StatCard
                  title="Study Hours This Week"
                  value={stats.studyHours}
                  icon={<ClockIcon className="w-6 h-6" />}
                  color="green"
                />
              </div>
            </Card>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* My Study Groups */}
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">My Study Groups</h2>
                    <Button variant="primary" className="flex items-center space-x-2">
                      <PlusIcon className="w-4 h-4" />
                      <span>Create New Group</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groups.length === 0 ? (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        <p>No study groups yet. Create your first group!</p>
                      </div>
                    ) : (
                      groups.slice(0, 4).map((group) => (
                        <div
                          key={group._id}
                          className={`p-4 border-2 rounded-lg hover:shadow-md transition-shadow ${getColorClasses('blue')}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{group.name}</h3>
                              <p className="text-sm text-gray-600">{group.subject}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1 text-gray-600">
                              <UsersIcon className="w-4 h-4" />
                              <span>{group.members?.length || 0} members</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(group.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Button variant="outline" className="w-full mt-3 text-sm">
                            Enter Group
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </Card>

                {/* Today's Tasks */}
                <Card>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Tasks</h2>
                  {todayTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No tasks due today. Great job!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {todayTasks.map((task) => (
                        <div
                          key={task._id}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                            task.status === 'completed'
                              ? 'bg-gray-50 border-gray-200'
                              : 'bg-white border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <button
                            onClick={() => toggleTaskStatus(task._id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              task.status === 'completed'
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 hover:border-primary-500'
                            }`}
                          >
                            {task.status === 'completed' && (
                              <CheckIcon className="w-4 h-4 text-white" />
                            )}
                          </button>
                          <div className="flex-1">
                            <p className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDueDate(task.dueDate)} at {formatTime(task.dueDate)}
                            </p>
                          </div>
                          <Badge variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'default'}>
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Recent Activity */}
                <Card>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                  <div className="text-center py-8 text-gray-500">
                    <p>Activity tracking coming soon...</p>
                  </div>
                </Card>
              </div>

              {/* Right Column - Sidebar Content */}
              <div className="space-y-6">
                {/* Upcoming Deadlines */}
                <Card>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Deadlines</h2>
                  {upcomingDeadlines.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <p className="text-sm">No upcoming deadlines</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingDeadlines.map((deadline) => (
                        <div key={deadline._id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="font-semibold text-gray-900 text-sm">{deadline.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{deadline.subject || 'General'}</p>
                          <div className="flex items-center space-x-2 mt-2 text-xs text-red-700">
                            <ClockIcon className="w-4 h-4" />
                            <span>{formatDueDate(deadline.dueDate)} at {formatTime(deadline.dueDate)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Motivational Quote */}
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <div className="text-center">
                    <div className="text-4xl mb-3">💡</div>
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      "Education is the most powerful weapon which you can use to change the world."
                    </p>
                    <p className="text-xs text-gray-600">- Nelson Mandela</p>
                  </div>
                </Card>

                {/* Study Reminder */}
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Study Reminder</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Don't forget to review your notes for Data Structures today!
                  </p>
                  <Button variant="success" className="w-full text-sm">
                    Start Studying
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
