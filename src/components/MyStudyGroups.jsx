import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import CreateGroupModal from './CreateGroupModal';
import { Button } from './common/UIComponents';
import { PlusIcon, UsersIcon, ClockIcon, MenuIcon } from './common/Icons';
import { useAuth } from '../contexts/AuthContext';
import { groupAPI } from '../services/apiService';

const MyStudyGroups = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studyGroups, setStudyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Fetch groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        setError(null);
        const groupsData = await groupAPI.getUserGroups(currentUser.uid);
        setStudyGroups(groupsData || []);
      } catch (err) {
        console.error('Error fetching groups:', err);
        setError('Failed to load study groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [currentUser]);

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 hover:border-blue-300 hover:shadow-blue-100',
      purple: 'bg-purple-50 border-purple-200 hover:border-purple-300 hover:shadow-purple-100',
      green: 'bg-green-50 border-green-200 hover:border-green-300 hover:shadow-green-100',
      orange: 'bg-orange-50 border-orange-200 hover:border-orange-300 hover:shadow-orange-100',
      pink: 'bg-pink-50 border-pink-200 hover:border-pink-300 hover:shadow-pink-100',
      indigo: 'bg-indigo-50 border-indigo-200 hover:border-indigo-300 hover:shadow-indigo-100',
    };
    return colors[color] || colors.blue;
  };

  const getTextColorClass = (color) => {
    const colors = {
      blue: 'text-blue-700',
      purple: 'text-purple-700',
      green: 'text-green-700',
      orange: 'text-orange-700',
      pink: 'text-pink-700',
      indigo: 'text-indigo-700',
    };
    return colors[color] || colors.blue;
  };

  const handleCreateGroup = async (groupData) => {
    try {
      const newGroup = await groupAPI.createGroup({
        groupName: groupData.name,
        subject: groupData.subject,
        description: groupData.description,
        isPublic: groupData.isPublic,
      });

      setStudyGroups([newGroup, ...studyGroups]);
      alert(`Group "${groupData.name}" created successfully!`);
    } catch (err) {
      console.error('Error creating group:', err);
      alert('Failed to create group. Please try again.');
    }
  };

  const handleEnterGroup = (groupId) => {
    alert(`Entering group ID: ${groupId} - Group detail page coming soon!`);
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
              <p className="text-gray-600">Loading study groups...</p>
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Study Groups</h1>
                <p className="text-gray-600">Manage and explore your learning communities</p>
              </div>
              <Button
                variant="primary"
                className="flex items-center justify-center space-x-2"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusIcon className="w-5 h-5" />
                <span>Create New Group</span>
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Total Groups</p>
                <p className="text-3xl font-bold text-gray-900">{studyGroups.length}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Public Groups</p>
                <p className="text-3xl font-bold text-gray-900">
                  {studyGroups.filter(g => g.isPublic).length}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Total Members</p>
                <p className="text-3xl font-bold text-gray-900">
                  {studyGroups.reduce((sum, g) => sum + (g.members?.length || 0), 0)}
                </p>
              </div>
            </div>

            {/* Groups Grid */}
            {studyGroups.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <UsersIcon className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No study groups yet</h3>
                <p className="text-gray-600 mb-6">Create your first study group to get started!</p>
                <Button onClick={() => setIsModalOpen(true)}>
                  Create Your First Group
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studyGroups.map((group) => (
                  <div
                    key={group._id}
                    className={`rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${getColorClasses('blue')}`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold mb-1 ${getTextColorClass('blue')}`}>
                          {group.name}
                        </h3>
                        <span className="inline-block px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700">
                          {group.subject}
                        </span>
                      </div>
                      {!group.isPublic && (
                        <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                          Private
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                      {group.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <UsersIcon className="w-4 h-4" />
                        <span>{group.members?.length || 0} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{new Date(group.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => handleEnterGroup(group._id)}
                    >
                      Enter Group
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
};

export default MyStudyGroups;
