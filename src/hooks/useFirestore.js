// Custom hooks for Firestore operations
import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

// Hook for managing study groups
export const useGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Fetch groups where user is a member
  const fetchUserGroups = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const groupsRef = collection(db, 'groups');
      const q = query(
        groupsRef,
        where('members', 'array-contains', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const groupsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setGroups(groupsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new group
  const createGroup = async (groupData) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const groupRef = await addDoc(collection(db, 'groups'), {
        ...groupData,
        createdBy: currentUser.uid,
        members: [currentUser.uid],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await fetchUserGroups();
      return groupRef.id;
    } catch (err) {
      console.error('Error creating group:', err);
      throw err;
    }
  };

  // Join a group
  const joinGroup = async (groupId) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        members: arrayUnion(currentUser.uid),
        updatedAt: serverTimestamp(),
      });

      await fetchUserGroups();
    } catch (err) {
      console.error('Error joining group:', err);
      throw err;
    }
  };

  // Leave a group
  const leaveGroup = async (groupId) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        members: arrayRemove(currentUser.uid),
        updatedAt: serverTimestamp(),
      });

      await fetchUserGroups();
    } catch (err) {
      console.error('Error leaving group:', err);
      throw err;
    }
  };

  // Update a group
  const updateGroup = async (groupId, updates) => {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      await fetchUserGroups();
    } catch (err) {
      console.error('Error updating group:', err);
      throw err;
    }
  };

  // Delete a group
  const deleteGroup = async (groupId) => {
    try {
      await deleteDoc(doc(db, 'groups', groupId));
      await fetchUserGroups();
    } catch (err) {
      console.error('Error deleting group:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserGroups();
    }
  }, [currentUser]);

  return {
    groups,
    loading,
    error,
    createGroup,
    joinGroup,
    leaveGroup,
    updateGroup,
    deleteGroup,
    refreshGroups: fetchUserGroups,
  };
};

// Hook for managing tasks
export const useTasks = (groupId = null) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Fetch tasks
  const fetchTasks = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const tasksRef = collection(db, 'tasks');
      let q;

      if (groupId) {
        q = query(
          tasksRef,
          where('groupId', '==', groupId),
          orderBy('dueDate', 'asc')
        );
      } else {
        q = query(
          tasksRef,
          where('assignedTo', 'array-contains', currentUser.uid),
          orderBy('dueDate', 'asc')
        );
      }

      const snapshot = await getDocs(q);
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(tasksData);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (taskData) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const taskRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        createdBy: currentUser.uid,
        assignedTo: taskData.assignedTo || [currentUser.uid],
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await fetchTasks();
      return taskRef.id;
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  };

  // Update task
  const updateTask = async (taskId, updates) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      await fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  // Toggle task completion
  const toggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateTask(taskId, { status: newStatus });
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      await fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser, groupId]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    refreshTasks: fetchTasks,
  };
};

// Hook for managing resources/notes
export const useResources = (groupId = null) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Fetch resources
  const fetchResources = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const resourcesRef = collection(db, 'resources');
      let q;

      if (groupId) {
        q = query(
          resourcesRef,
          where('groupId', '==', groupId),
          orderBy('uploadedAt', 'desc')
        );
      } else {
        q = query(
          resourcesRef,
          where('uploadedBy', '==', currentUser.uid),
          orderBy('uploadedAt', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      const resourcesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setResources(resourcesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new resource entry
  const createResource = async (resourceData) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const resourceRef = await addDoc(collection(db, 'resources'), {
        ...resourceData,
        uploadedBy: currentUser.uid,
        uploadedAt: serverTimestamp(),
      });

      await fetchResources();
      return resourceRef.id;
    } catch (err) {
      console.error('Error creating resource:', err);
      throw err;
    }
  };

  // Delete resource
  const deleteResource = async (resourceId) => {
    try {
      await deleteDoc(doc(db, 'resources', resourceId));
      await fetchResources();
    } catch (err) {
      console.error('Error deleting resource:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchResources();
    }
  }, [currentUser, groupId]);

  return {
    resources,
    loading,
    error,
    createResource,
    deleteResource,
    refreshResources: fetchResources,
  };
};
