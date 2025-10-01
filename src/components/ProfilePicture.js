import React, { useState, useRef } from 'react';
import apiClient from '../utils/axios';

const ProfilePicture = ({ user, onUpdate, size = 'large' }) => {
  const [uploading, setUploading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef(null);

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-24 h-24',
    xlarge: 'w-32 h-32'
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadProfilePicture(file);
    }
    setShowMenu(false);
  };

  const uploadProfilePicture = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await apiClient.post('/api/user/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onUpdate(response.data.user);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const deleteProfilePicture = async () => {
    try {
      const response = await apiClient.delete('/api/user/profile-picture');
      onUpdate(response.data.user);
      setShowMenu(false);
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      alert('Failed to delete profile picture. Please try again.');
    }
  };

  const getProfileImageUrl = () => {
    if (user?.profilePicture) {
      // Check if it's a base64 image (starts with data:)
      if (user.profilePicture.startsWith('data:')) {
        return user.profilePicture;
      }
      // Fallback for old file-based images
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://your-backend-domain.vercel.app' 
        : 'http://localhost:5000';
      return `${baseUrl}${user.profilePicture}`;
    }
    return null;
  };

  const getInitials = () => {
    return user?.name?.charAt(0)?.toUpperCase() || 'U';
  };

  return (
    <div className="relative">
      <div 
        className={`${sizeClasses[size]} rounded-full overflow-hidden cursor-pointer group relative`}
        onClick={() => setShowMenu(!showMenu)}
      >
        {getProfileImageUrl() ? (
          <img
            src={getProfileImageUrl()}
            alt={user?.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {getInitials()}
            </span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        {/* Loading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>

      {/* Dropdown menu */}
      {showMenu && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[160px]">
          <button
            onClick={() => {
              fileInputRef.current?.click();
              setShowMenu(false);
            }}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Upload Photo</span>
          </button>
          
          {user?.profilePicture && (
            <button
              onClick={deleteProfilePicture}
              className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Remove Photo</span>
            </button>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default ProfilePicture;