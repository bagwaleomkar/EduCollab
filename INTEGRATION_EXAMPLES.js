// Example: How to integrate Firebase hooks into MyStudyGroups component

import React, { useState } from 'react';
import { useGroups } from '../hooks/useFirestore';
import { useAuth } from '../contexts/AuthContext';

const MyStudyGroupsExample = () => {
  const { currentUser } = useAuth();
  const { groups, loading, error, createGroup, joinGroup } = useGroups();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    groupName: '',
    subject: '',
    description: '',
    isPublic: true,
  });

  // Create new group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await createGroup(formData);
      setShowModal(false);
      // Reset form
      setFormData({ groupName: '', subject: '', description: '', isPublic: true });
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group');
    }
  };

  // Join existing group
  const handleJoinGroup = async (groupId) => {
    try {
      await joinGroup(groupId);
      alert('Successfully joined group!');
    } catch (error) {
      console.error('Error joining group:', error);
      alert('Failed to join group');
    }
  };

  if (loading) {
    return <div>Loading groups...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>My Study Groups</h1>
      
      {/* Display groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <div key={group.id} className="border rounded-lg p-4">
            <h3>{group.groupName}</h3>
            <p>{group.subject}</p>
            <p>{group.description}</p>
            <p>Members: {group.members.length}</p>
          </div>
        ))}
      </div>

      {/* Create Group Button */}
      <button onClick={() => setShowModal(true)}>
        Create New Group
      </button>

      {/* Create Group Modal */}
      {showModal && (
        <form onSubmit={handleCreateGroup}>
          <input
            type="text"
            placeholder="Group Name"
            value={formData.groupName}
            onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <label>
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
            />
            Public Group
          </label>
          <button type="submit">Create Group</button>
          <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

// ============================================================
// Example: How to integrate useTasks hook
// ============================================================

import { useTasks } from '../hooks/useFirestore';

const TasksPlannerExample = () => {
  const { tasks, loading, createTask, updateTask, toggleTaskStatus } = useTasks();
  const [showModal, setShowModal] = useState(false);

  const handleCreateTask = async (taskData) => {
    try {
      await createTask({
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority, // 'high', 'medium', 'low'
        groupId: taskData.groupId || null,
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      await toggleTaskStatus(taskId, currentStatus);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div>
      <h1>Tasks & Planner</h1>
      {tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Priority: {task.priority}</p>
          <p>Status: {task.status}</p>
          <button onClick={() => handleToggleTask(task.id, task.status)}>
            {task.status === 'completed' ? 'Mark as Pending' : 'Mark as Complete'}
          </button>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// Example: How to upload files with Firebase Storage
// ============================================================

import { useResources } from '../hooks/useFirestore';
import { uploadFile } from '../services/storageService';

const NotesResourcesExample = () => {
  const { resources, loading, createResource } = useResources();
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file (optional)
    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    try {
      setUploading(true);
      
      // Upload file to Firebase Storage
      const storagePath = `resources/${currentUser.uid}/`;
      const uploadResult = await uploadFile(file, storagePath, (progress) => {
        setUploadProgress(progress);
      });

      // Save metadata to Firestore
      await createResource({
        fileName: uploadResult.originalName,
        fileUrl: uploadResult.url,
        filePath: uploadResult.path,
        fileSize: uploadResult.size,
        fileType: uploadResult.type,
        subject: 'Mathematics', // Get from form
        description: 'Sample description', // Get from form
        groupId: null, // Optional: associate with a group
      });

      alert('File uploaded successfully!');
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Notes & Resources</h1>
      
      {/* File upload */}
      <div>
        <input
          type="file"
          onChange={handleFileUpload}
          disabled={uploading}
          accept=".pdf,.ppt,.pptx,.doc,.docx"
        />
        {uploading && (
          <div>
            <p>Uploading... {uploadProgress}%</p>
            <div style={{ width: '100%', backgroundColor: '#e0e0e0' }}>
              <div
                style={{
                  width: `${uploadProgress}%`,
                  height: '10px',
                  backgroundColor: '#4caf50',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Display resources */}
      <div>
        {resources.map((resource) => (
          <div key={resource.id}>
            <h3>{resource.fileName}</h3>
            <p>{resource.subject}</p>
            <p>{resource.description}</p>
            <a href={resource.fileUrl} download target="_blank" rel="noopener noreferrer">
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export {
  MyStudyGroupsExample,
  TasksPlannerExample,
  NotesResourcesExample,
};
