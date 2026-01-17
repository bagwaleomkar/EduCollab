import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AddTaskModal from './AddTaskModal';
import { Button, Badge } from './common/UIComponents';
import { PlusIcon, CheckIcon, ClockIcon, MenuIcon } from './common/Icons';
import { useAuth } from '../contexts/AuthContext';
import { taskAPI } from '../services/apiService';

const TasksPlanner = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        setError(null);
        const tasksData = await taskAPI.getUserTasks(currentUser.uid);
        setTasks(tasksData || []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentUser]);

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

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskAPI.createTask({
        title: taskData.title,
        description: taskData.description,
        subject: taskData.subject,
        dueDate: new Date(`${taskData.dueDate}T${taskData.dueTime}`).toISOString(),
        priority: taskData.priority,
      });

      setTasks([newTask, ...tasks]);
    } catch (err) {
      console.error('Error adding task:', err);
      alert('Failed to add task. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dateString);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (taskDate.getTime() === today.getTime() + 86400000) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'danger',
      medium: 'warning',
      low: 'success',
    };
    return variants[priority] || 'default';
  };

  const isToday = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dateString);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  };

  const isPast = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dateString);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() < today.getTime();
  };

  const filterTasks = (taskList) => {
    if (priorityFilter === 'all') return taskList;
    return taskList.filter(task => task.priority === priorityFilter);
  };

  const todayTasks = filterTasks(tasks.filter(task => 
    task.status !== 'completed' && isToday(task.dueDate)
  ));

  const upcomingTasks = filterTasks(tasks.filter(task => 
    task.status !== 'completed' && !isToday(task.dueDate) && !isPast(task.dueDate)
  ));

  const completedTasks = filterTasks(tasks.filter(task => task.status === 'completed'));

  const TaskCard = ({ task }) => (
    <div
      className={`bg-white rounded-lg border-2 p-4 transition-all hover:shadow-md ${
        task.status === 'completed'
          ? 'border-gray-200 bg-gray-50'
          : 'border-gray-200 hover:border-primary-300'
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <button
          onClick={() => toggleTaskStatus(task._id)}
          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
            task.status === 'completed'
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-primary-500'
          }`}
        >
          {task.status === 'completed' && (
            <CheckIcon className="w-4 h-4 text-white" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-semibold text-gray-900 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            <Badge variant={getPriorityBadge(task.priority)} className="ml-2 flex-shrink-0">
              {task.priority}
            </Badge>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="inline-flex items-center px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
              {task.subject}
            </span>
            <span className="flex items-center space-x-1">
              <ClockIcon className="w-4 h-4" />
              <span>{formatDate(task.dueDate)} at {formatTime(task.dueDate)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const EmptyTaskList = ({ message }) => (
    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div className="text-gray-400 mb-3">
        <CheckIcon className="w-12 h-12 mx-auto" />
      </div>
      <p className="text-gray-600">{message}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <main className="flex-1 lg:ml-64 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tasks...</p>
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks & Planner</h1>
                <p className="text-gray-600">Organize and track your study tasks</p>
              </div>
              <Button
                variant="primary"
                className="flex items-center justify-center space-x-2"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusIcon className="w-5 h-5" />
                <span>Add Task</span>
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {tasks.filter(t => t.status !== 'completed').length}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length}
                </p>
              </div>
            </div>

            {/* Priority Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setPriorityFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    priorityFilter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  All Tasks
                </button>
                <button
                  onClick={() => setPriorityFilter('high')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    priorityFilter === 'high'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  High Priority
                </button>
                <button
                  onClick={() => setPriorityFilter('medium')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    priorityFilter === 'medium'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Medium Priority
                </button>
                <button
                  onClick={() => setPriorityFilter('low')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    priorityFilter === 'low'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Low Priority
                </button>
              </div>
            </div>

            {/* Task Lists */}
            <div className="space-y-8">
              {/* Today's Tasks */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Today</h2>
                {todayTasks.length === 0 ? (
                  <EmptyTaskList message="No tasks due today!" />
                ) : (
                  <div className="space-y-3">
                    {todayTasks.map(task => (
                      <TaskCard key={task._id} task={task} />
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming Tasks */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming</h2>
                {upcomingTasks.length === 0 ? (
                  <EmptyTaskList message="No upcoming tasks!" />
                ) : (
                  <div className="space-y-3">
                    {upcomingTasks.map(task => (
                      <TaskCard key={task._id} task={task} />
                    ))}
                  </div>
                )}
              </div>

              {/* Completed Tasks */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Completed</h2>
                {completedTasks.length === 0 ? (
                  <EmptyTaskList message="No completed tasks yet!" />
                ) : (
                  <div className="space-y-3">
                    {completedTasks.map(task => (
                      <TaskCard key={task._id} task={task} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
};

export default TasksPlanner;
