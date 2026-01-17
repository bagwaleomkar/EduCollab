import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import UploadResourceModal from './UploadResourceModal';
import { Button, Badge } from './common/UIComponents';
import { PlusIcon, SearchIcon, MenuIcon, ClockIcon } from './common/Icons';
import { useAuth } from '../contexts/AuthContext';
import { resourceAPI } from '../services/apiService';

const NotesResources = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Fetch resources on component mount
  useEffect(() => {
    const fetchResources = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        setError(null);
        const resourcesData = await resourceAPI.getUserResources(currentUser.uid);
        setResources(resourcesData || []);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [currentUser]);

  const getFileIcon = (fileType) => {
    const icons = {
      pdf: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24">
          <rect x="4" y="2" width="16" height="20" rx="2" fill="#EF4444" />
          <text x="12" y="15" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">PDF</text>
        </svg>
      ),
      ppt: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24">
          <rect x="4" y="2" width="16" height="20" rx="2" fill="#F97316" />
          <text x="12" y="15" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">PPT</text>
        </svg>
      ),
      doc: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24">
          <rect x="4" y="2" width="16" height="20" rx="2" fill="#3B82F6" />
          <text x="12" y="15" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">DOC</text>
        </svg>
      ),
      txt: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24">
          <rect x="4" y="2" width="16" height="20" rx="2" fill="#6B7280" />
          <text x="12" y="15" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">TXT</text>
        </svg>
      ),
    };
    return icons[fileType] || icons.pdf;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleUploadResource = async (resourceData) => {
    try {
      const newResource = await resourceAPI.createResource({
        title: resourceData.fileName,
        description: resourceData.description,
        fileType: resourceData.fileType,
        subject: resourceData.subject,
        fileUrl: resourceData.fileUrl || '#',
        fileSize: resourceData.fileSize || 'N/A',
      });

      setResources([newResource, ...resources]);
      alert('Resource uploaded successfully!');
    } catch (err) {
      console.error('Error uploading resource:', err);
      alert('Failed to upload resource. Please try again.');
    }
  };

  const handleDownload = (resource) => {
    alert(`Downloading: ${resource.fileName}\n(Download functionality will be implemented with backend)`);
  };

  const handlePreview = (resource) => {
    alert(`Previewing: ${resource.fileName}\n(Preview functionality will be implemented with backend)`);
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || resource.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const subjects = ['all', ...new Set(resources.map(r => r.subject).filter(Boolean))];

  const ResourceCard = ({ resource }) => (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 hover:shadow-lg transition-all">
      {/* File Icon */}
      <div className="flex items-center justify-center mb-4">
        {getFileIcon(resource.fileType)}
      </div>

      {/* File Name */}
      <h3 className="font-semibold text-gray-900 mb-2 text-center line-clamp-2 min-h-[3rem]">
        {resource.title}
      </h3>

      {/* Subject Badge */}
      <div className="flex justify-center mb-3">
        <Badge variant="info" className="text-xs">
          {resource.subject}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
        {resource.description}
      </p>

      {/* Meta Info */}
      <div className="space-y-2 mb-4 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {currentUser?.displayName || 'Unknown'}
          </span>
          <span>{resource.fileSize}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-1" />
            {formatDate(resource.createdAt)}
          </span>
          <span>0 downloads</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="text-sm py-2"
          onClick={() => handlePreview(resource)}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </Button>
        <Button
          variant="primary"
          className="text-sm py-2"
          onClick={() => handleDownload(resource)}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </Button>
      </div>
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
              <p className="text-gray-600">Loading resources...</p>
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Notes & Resources</h1>
                <p className="text-gray-600">Share and access study materials</p>
              </div>
              <Button
                variant="primary"
                className="flex items-center justify-center space-x-2"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusIcon className="w-5 h-5" />
                <span>Upload Resource</span>
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
                <p className="text-sm text-gray-600 mb-1">Total Resources</p>
                <p className="text-2xl font-bold text-gray-900">{resources.length}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">PDF Files</p>
                <p className="text-2xl font-bold text-red-600">
                  {resources.filter(r => r.fileType === 'pdf').length}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Total Size</p>
                <p className="text-2xl font-bold text-green-600">
                  {resources.length > 0 ? `${resources.length * 2} MB` : '0 MB'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Your Uploads</p>
                <p className="text-2xl font-bold text-blue-600">
                  {resources.filter(r => r.userId === currentUser?.uid).length}
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search resources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Subject Filter */}
                <div className="w-full md:w-64">
                  <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>
                        {subject === 'all' ? 'All Subjects' : subject}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Resources Grid */}
            {filteredResources.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || subjectFilter !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Upload your first study resource to get started!'}
                </p>
                {!searchQuery && subjectFilter === 'all' && (
                  <Button onClick={() => setIsModalOpen(true)}>
                    Upload Resource
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    Showing {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map(resource => (
                    <ResourceCard key={resource._id} resource={resource} />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      <UploadResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadResource={handleUploadResource}
      />
    </div>
  );
};

export default NotesResources;
