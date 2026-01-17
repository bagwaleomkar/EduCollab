// Authentication Context Provider
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { userAPI } from '../services/apiService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create user profile in MongoDB via API
  const createUserProfile = async (user, additionalData = {}) => {
    if (!user) return;

    try {
      const userData = {
        name: user.displayName || additionalData.name || user.email.split('@')[0],
        email: user.email,
        role: additionalData.role || 'student',
        photoURL: user.photoURL || null,
      };

      const profile = await userAPI.createOrUpdateUser(userData);
      return profile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  // Sign up with email and password
  const signup = async (email, password, name, role = 'student') => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(result.user, {
        displayName: name,
      });

      // Create user profile in MongoDB
      await createUserProfile(result.user, { name, role });

      return result.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Create user profile if it doesn't exist
      await createUserProfile(result.user);

      return result.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Get user profile from MongoDB
  const getUserProfile = async (uid) => {
    try {
      const profile = await userAPI.getUser(uid);
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get additional user data from MongoDB
        try {
          const profile = await getUserProfile(user.uid);
          setCurrentUser({ ...user, profile });
        } catch (error) {
          console.error('Error loading profile:', error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    signInWithGoogle,
    logout,
    getUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

