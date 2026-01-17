import React, { useState } from 'react';
import { Button } from './common/UIComponents';
import { CloseIcon } from './common/Icons';

const UploadResourceModal = ({ isOpen, onClose, onUploadResource }) => {
  const [formData, setFormData] = useState({
    fileName: '',
    fileType: 'pdf',
    subject: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  const subjects = [
    'Advanced JavaScript',
    'Data Structures',
    'Machine Learning Basics',
    'Web Development',
    'React Advanced Patterns',
    'Python for Data Science',
    'Mathematics',
    'Physics',
    'General',
  ];

  const fileTypes = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'ppt', label: 'PowerPoint' },
    { value: 'doc', label: 'Word Document' },
    { value: 'txt', label: 'Text File' },
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        fileName: file.name,
      }));
      if (errors.fileName) {
        setErrors(prev => ({ ...prev, fileName: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fileName.trim()) {
      newErrors.fileName = 'Please select a file';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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

    // Upload resource
    onUploadResource(formData);
    
    // Reset form
    setFormData({
      fileName: '',
      fileType: 'pdf',
      subject: '',
      description: '',
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
            <h2 className="text-2xl font-bold text-gray-900">Upload Resource</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <CloseIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={`flex items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    errors.fileName 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 hover:border-primary-500 bg-gray-50 hover:bg-primary-50'
                  }`}
                >
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600">
                      {formData.fileName || 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, PPT, DOC up to 10MB
                    </p>
                  </div>
                </label>
              </div>
              {errors.fileName && (
                <p className="error-message">{errors.fileName}</p>
              )}
            </div>

            {/* File Type */}
            <div>
              <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 mb-2">
                File Type
              </label>
              <select
                id="fileType"
                name="fileType"
                value={formData.fileType}
                onChange={handleChange}
                className="input-field"
              >
                {fileTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject / Tag *
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
                placeholder="Brief description of the resource..."
              />
              {errors.description && (
                <p className="error-message">{errors.description}</p>
              )}
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
                Upload
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadResourceModal;
