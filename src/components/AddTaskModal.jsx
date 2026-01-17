import React, { useState } from 'react';
import { Button } from './common/UIComponents';
import { CloseIcon } from './common/Icons';

const AddTaskModal = ({ isOpen, onClose, onAddTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium',
  });

  const [errors, setErrors] = useState({});

  const subjects = [
    'Advanced JavaScript',
    'Data Structures',
    'Machine Learning Basics',
    'Web Development',
    'React Advanced Patterns',
    'Python for Data Science',
    'General',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (!formData.dueTime) {
      newErrors.dueTime = 'Due time is required';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Add task
    onAddTask(formData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      subject: '',
      dueDate: '',
      dueTime: '',
      priority: 'medium',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 z-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Task</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <CloseIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Task Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input-field ${errors.title ? 'input-error' : ''}`}
                placeholder="e.g., Complete React assignment"
              />
              {errors.title && (
                <p className="error-message">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="input-field resize-none"
                placeholder="Add any additional details..."
              />
            </div>

            {/* Subject/Group */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject / Group *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`input-field ${errors.subject ? 'input-error' : ''}`}
              >
                <option value="">Select a subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              {errors.subject && (
                <p className="error-message">{errors.subject}</p>
              )}
            </div>

            {/* Due Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={`input-field ${errors.dueDate ? 'input-error' : ''}`}
                />
                {errors.dueDate && (
                  <p className="error-message">{errors.dueDate}</p>
                )}
              </div>
              <div>
                <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Due Time *
                </label>
                <input
                  type="time"
                  id="dueTime"
                  name="dueTime"
                  value={formData.dueTime}
                  onChange={handleChange}
                  className={`input-field ${errors.dueTime ? 'input-error' : ''}`}
                />
                {errors.dueTime && (
                  <p className="error-message">{errors.dueTime}</p>
                )}
              </div>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['low', 'medium', 'high'].map(priority => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority }))}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition-all capitalize ${
                      formData.priority === priority
                        ? priority === 'high'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : priority === 'medium'
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
                type="button"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                type="submit"
              >
                Add Task
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
