import React, { useState } from 'react';
import { Button } from './common/UIComponents';
import { CloseIcon } from './common/Icons';

const CreateGroupModal = ({ isOpen, onClose, onCreateGroup }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    isPublic: true,
  });

  const [errors, setErrors] = useState({});

  const subjects = [
    'Programming',
    'Computer Science',
    'AI & ML',
    'Web Development',
    'Data Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Group name must be at least 3 characters';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
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

    // Create group
    onCreateGroup(formData);
    
    // Reset form
    setFormData({
      name: '',
      subject: '',
      description: '',
      isPublic: true,
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
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 z-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Group</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <CloseIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Group Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g., Advanced JavaScript Study"
              />
              {errors.name && (
                <p className="error-message">{errors.name}</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject / Category *
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

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`input-field resize-none ${errors.description ? 'input-error' : ''}`}
                placeholder="Brief description of what this group is about..."
              />
              {errors.description && (
                <p className="error-message">{errors.description}</p>
              )}
            </div>

            {/* Public/Private Toggle */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="isPublic" className="text-sm font-medium text-gray-900">
                    Public Group
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    {formData.isPublic 
                      ? 'Anyone can find and join this group' 
                      : 'Only invited members can join'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.isPublic ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
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
                Create Group
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
