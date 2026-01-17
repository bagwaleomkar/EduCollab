import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Card, StatCard, Badge } from './common/UIComponents';
import { 
  ClockIcon, 
  CheckIcon, 
  UsersIcon,
  TrendingUpIcon,
  CalendarIcon,
  AwardIcon,
  MenuIcon
} from './common/Icons';
import { useAuth } from '../contexts/AuthContext';
import { taskAPI, groupAPI } from '../services/apiService';

const Progress = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Fetch data on component mount
  useEffect(() => {
    const fetchProgressData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        setError(null);
        const [tasksData, groupsData] = await Promise.all([
          taskAPI.getUserTasks(currentUser.uid),
          groupAPI.getUserGroups(currentUser.uid),
        ]);
        setTasks(tasksData || []);
        setGroups(groupsData || []);
      } catch (err) {
        console.error('Error fetching progress data:', err);
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [currentUser]);

  // Calculate real stats
  const summaryStats = {
    studyHours: 0, // Could be calculated from task completion times
    tasksCompleted: tasks.filter(t => t.status === 'completed').length,
    activeGroups: groups.length,
    currentStreak: 0 // Would need streak tracking in backend
  };

  // Calculate subject progress from tasks
  const subjectProgress = tasks.reduce((acc, task) => {
    const subject = task.subject || 'General';
    if (!acc[subject]) {
      acc[subject] = { total: 0, completed: 0 };
    }
    acc[subject].total++;
    if (task.status === 'completed') acc[subject].completed++;
    return acc;
  }, {});

  const subjectProgressArray = Object.entries(subjectProgress).map(([subject, data], idx) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];
    return {
      subject,
      progress: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      hoursSpent: 0,
      color: colors[idx % colors.length]
    };
  });

  const taskCompletionRate = {
    completed: tasks.filter(t => t.status === 'completed').length,
    total: tasks.length,
    percentage: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0
  };

  // Mock weekly study data (would need real time tracking)
  const weeklyStudyData = [
    { day: 'Mon', hours: 0 },
    { day: 'Tue', hours: 0 },
    { day: 'Wed', hours: 0 },
    { day: 'Thu', hours: 0 },
    { day: 'Fri', hours: 0 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 0 }
  ];

  const maxHours = Math.max(...weeklyStudyData.map(d => d.hours), 1);

  // Recent activities placeholder (would need activity tracking)
  const recentActivities = [
    // Empty for now - would be populated from backend activity logs
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <main className="flex-1 lg:ml-64 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading progress...</p>
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

          <div className="p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress Overview</h1>
          <p className="text-gray-600 mt-1">Track your learning journey and achievements</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === 'year'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={ClockIcon}
          title="Study Hours"
          value={summaryStats.studyHours}
          subtitle="This week"
          color="bg-blue-500"
        />
        <StatCard
          icon={CheckIcon}
          title="Tasks Completed"
          value={summaryStats.tasksCompleted}
          subtitle="This month"
          color="bg-green-500"
        />
        <StatCard
          icon={UsersIcon}
          title="Active Groups"
          value={summaryStats.activeGroups}
          subtitle="Currently participating"
          color="bg-purple-500"
        />
        <StatCard
          icon={AwardIcon}
          title="Current Streak"
          value={`${summaryStats.currentStreak} days`}
          subtitle="Keep it up!"
          color="bg-yellow-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Study Hours Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Weekly Study Hours</h2>
              <p className="text-gray-600 text-sm mt-1">Total: {weeklyStudyData.reduce((acc, d) => acc + d.hours, 0).toFixed(1)} hours</p>
            </div>
            <TrendingUpIcon className="w-6 h-6 text-green-600" />
          </div>
          
          {/* Bar Chart Placeholder */}
          <div className="space-y-4">
            <div className="flex items-end justify-between h-64 gap-4">
              {weeklyStudyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100%' }}>
                    <div
                      className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all duration-500 absolute bottom-0"
                      style={{ height: `${(data.hours / maxHours) * 100}%` }}
                    >
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-900">
                        {data.hours}h
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{data.day}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Task Completion Rate */}
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Task Completion</h2>
            <p className="text-gray-600 text-sm mt-1">This month</p>
          </div>
          
          {/* Circular Progress Placeholder */}
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-48 h-48">
              {/* Background Circle */}
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#e5e7eb"
                  strokeWidth="16"
                  fill="none"
                />
                {/* Progress Circle */}
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#6366f1"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - taskCompletionRate.percentage / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">{taskCompletionRate.percentage}%</span>
                <span className="text-sm text-gray-600 mt-1">Completed</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-700">
                <span className="font-semibold text-green-600">{taskCompletionRate.completed}</span>
                {' '}out of{' '}
                <span className="font-semibold">{taskCompletionRate.total}</span>
                {' '}tasks
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Subject-wise Progress */}
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Subject-wise Progress</h2>
          <p className="text-gray-600 text-sm mt-1">Your performance across different subjects</p>
        </div>
        
        <div className="space-y-6">
          {subjectProgress.map((subject, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
                  <span className="font-medium text-gray-900">{subject.subject}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{subject.hoursSpent}h studied</span>
                  <span className="font-semibold text-gray-900 min-w-[3rem] text-right">
                    {subject.progress}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${subject.color} transition-all duration-500`}
                  style={{ width: `${subject.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Activity Log */}
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <p className="text-gray-600 text-sm mt-1">Your latest learning activities</p>
        </div>
        
        {recentActivities.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No recent activity to display</p>
            <p className="text-sm text-gray-400 mt-2">Complete tasks and join groups to see your activity here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-3 rounded-lg ${activity.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {activity.time}
                      </span>
                      {activity.duration && (
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {activity.duration}
                        </span>
                      )}
                    </div>
                </div>
                {activity.type === 'achievement' && (
                  <Badge variant="warning">Achievement</Badge>
                )}
              </div>
            );
          })}
          </div>
        )}
      </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Progress;
