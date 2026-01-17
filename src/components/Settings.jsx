import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, updatePassword } from 'firebase/auth';
import { userAPI } from '../services/apiService';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Card } from './common/UIComponents';
import { 
  MenuIcon, 
  SettingsIcon,
  LogoutIcon,
  CheckIcon 
} from './common/Icons';

const Settings = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Form states
  const [profileData, setProfileData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    photoURL: currentUser?.photoURL || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: false,
  });
  
  // Loading and message states
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
  });
  
  const [messages, setMessages] = useState({
    profile: '',
    password: '',
    preferences: '',
  });
  
  const [errors, setErrors] = useState({
    profile: '',
    password: '',
  });

  // Show message temporarily
  const showMessage = (type, message) => {
    setMessages(prev => ({ ...prev, [type]: message }));
    setTimeout(() => {
      setMessages(prev => ({ ...prev, [type]: '' }));
    }, 3000);
  };

  // Show error temporarily
  const showError = (type, error) => {
    setErrors(prev => ({ ...prev, [type]: error }));
    setTimeout(() => {
      setErrors(prev => ({ ...prev, [type]: '' }));
    }, 5000);
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, profile: true }));
    setErrors(prev => ({ ...prev, profile: '' }));
    
    try {
      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: profileData.name,
        photoURL: profileData.photoURL,
      });

      // Update MongoDB user document via API
      if (currentUser?.uid) {
        await userAPI.updateUser(currentUser.uid, {
          name: profileData.name,
          photoURL: profileData.photoURL,
        });
      }

      showMessage('profile', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('profile', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, password: true }));
    setErrors(prev => ({ ...prev, password: '' }));

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('password', 'New passwords do not match.');
      setLoading(prev => ({ ...prev, password: false }));
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError('password', 'Password must be at least 6 characters long.');
      setLoading(prev => ({ ...prev, password: false }));
      return;
    }

    try {
      await updatePassword(currentUser, passwordData.newPassword);
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      showMessage('password', 'Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      
      let errorMessage = 'Failed to change password. ';
      if (error.code === 'auth/requires-recent-login') {
        errorMessage += 'Please log out and log in again before changing your password.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage += 'Password is too weak.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      showError('password', errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  // Handle preferences update
  const handlePreferenceChange = (key) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, [key]: !prev[key] };
      
      // Show success message
      showMessage('preferences', 'Preference updated!');
      
      // Apply dark mode if toggled (you can implement this later)
      if (key === 'darkMode') {
        document.documentElement.classList.toggle('dark', newPrefs.darkMode);
      }
      
      return newPrefs;
    });
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <SettingsIcon className="w-8 h-8 text-primary-600" />
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              </div>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>

            <div className="max-w-4xl space-y-6">
              {/* Profile Settings */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Settings</h2>
                  
                  {/* Success Message */}
                  {messages.profile && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                      <CheckIcon className="w-5 h-5 mr-2" />
                      <span>{messages.profile}</span>
                    </div>
                  )}
                  
                  {/* Error Message */}
                  {errors.profile && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {errors.profile}
                    </div>
                  )}

                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    {/* Profile Picture Preview */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        {profileData.photoURL ? (
                          <img
                            src={profileData.photoURL}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          profileData.name.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{profileData.name || 'Your Name'}</p>
                        <p className="text-sm text-gray-500 capitalize">{currentUser?.profile?.role || 'student'}</p>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                        disabled
                        readOnly
                      />
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    {/* Profile Picture URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Picture URL
                      </label>
                      <input
                        type="url"
                        value={profileData.photoURL}
                        onChange={(e) => setProfileData({ ...profileData, photoURL: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="https://example.com/your-photo.jpg"
                      />
                      <p className="mt-1 text-xs text-gray-500">Enter a URL to your profile picture</p>
                    </div>

                    {/* Save Button */}
                    <button
                      type="submit"
                      disabled={loading.profile}
                      className="w-full bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading.profile ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        'Save Profile Changes'
                      )}
                    </button>
                  </form>
                </div>
              </Card>

              {/* Account Settings */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
                  
                  {/* Success Message */}
                  {messages.password && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                      <CheckIcon className="w-5 h-5 mr-2" />
                      <span>{messages.password}</span>
                    </div>
                  )}
                  
                  {/* Error Message */}
                  {errors.password && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {errors.password}
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-4 mb-6">
                    <h3 className="font-semibold text-gray-900">Change Password</h3>

                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter current password"
                      />
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter new password"
                        required
                      />
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Confirm new password"
                        required
                      />
                    </div>

                    {/* Change Password Button */}
                    <button
                      type="submit"
                      disabled={loading.password}
                      className="w-full bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading.password ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Changing Password...
                        </span>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </form>

                  {/* Logout Section */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Danger Zone</h3>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <LogoutIcon className="w-5 h-5" />
                      <span>Logout from Account</span>
                    </button>
                  </div>
                </div>
              </Card>

              {/* Preferences */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Preferences</h2>
                  
                  {/* Success Message */}
                  {messages.preferences && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                      <CheckIcon className="w-5 h-5 mr-2" />
                      <span>{messages.preferences}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Notifications Toggle */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">Enable Notifications</h3>
                        <p className="text-sm text-gray-500">Receive notifications about tasks and group updates</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('notifications')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences.notifications ? 'bg-primary-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">Dark Mode</h3>
                        <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('darkMode')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences.darkMode ? 'bg-primary-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.darkMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Account Info */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">User ID:</span>
                      <span className="font-mono text-gray-900">{currentUser?.uid?.slice(0, 20)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Created:</span>
                      <span className="text-gray-900">
                        {currentUser?.metadata?.creationTime 
                          ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Sign In:</span>
                      <span className="text-gray-900">
                        {currentUser?.metadata?.lastSignInTime 
                          ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
