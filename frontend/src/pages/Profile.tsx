import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Link as LinkIcon, Edit3, Camera, UserPlus, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import PostCard from '../components/PostCard';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, users, getPostsByUserId, updateProfile, followUser, unfollowUser } = useAuth();
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: '',
    website: ''
  });

  // Find user in users array or use currentUser if viewing own profile
  const user = userId === currentUser?.id 
    ? currentUser 
    : users.find(u => u.id === userId || u._id === userId);
    
  const userPosts = getPostsByUserId(userId!);
  const isOwnProfile = currentUser?.id === userId;
  const isFollowing = currentUser?.following.includes(userId!) || false;

  if (!user) {
    return (
      <div className={`text-center py-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <h2 className="text-2xl font-bold mb-2">User not found</h2>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          The user you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditForm({
        name: user.name,
        bio: user.bio,
        location: '',
        website: ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    updateProfile({
      name: editForm.name,
      bio: editForm.bio
    });
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser(user.id);
      toast.success(`Unfollowed ${user.name}`);
    } else {
      followUser(user.id);
      toast.success(`Now following ${user.name}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className={`rounded-2xl border transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white/70 border-gray-200 backdrop-blur-sm'
      } shadow-lg overflow-hidden`}>
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          {isOwnProfile && (
            <button className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors duration-200">
              <Camera size={18} />
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
              />
              {isOwnProfile && (
                <button className="absolute bottom-2 right-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 shadow-lg">
                  <Camera size={16} />
                </button>
              )}
            </div>

            {/* User Info & Actions */}
            <div className="flex-1 mt-4 sm:mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className={`text-2xl font-bold border rounded-lg px-2 py-1 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  ) : (
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.name}
                    </h1>
                  )}
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    @{user.email.split('@')[0]}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  {isOwnProfile ? (
                    <>
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSaveProfile}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                              isDark 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleEditToggle}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            isDark 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          <Edit3 size={16} />
                          <span>Edit Profile</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={handleFollowToggle}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isFollowing
                          ? `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white' : 'bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white'}`
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
                      <span>{isFollowing ? 'Following' : 'Follow'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4">
                {isEditing ? (
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className={`w-full border rounded-lg px-3 py-2 resize-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} max-w-2xl`}>
                    {user.bio || 'No bio yet.'}
                  </p>
                )}
              </div>

              {/* Meta Info */}
              <div className={`flex flex-wrap items-center gap-4 mt-4 text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin size={16} />
                  <span>Location not set</span>
                </div>
                <div className="flex items-center space-x-1">
                  <LinkIcon size={16} />
                  <span>Website not set</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="text-center">
                  <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {userPosts.length}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Posts
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {user.followers.length}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Followers
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {user.following.length}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Following
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-8">
        <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Posts ({userPosts.length})
        </h2>
        
        {userPosts.length > 0 ? (
          <div className="space-y-6">
            {userPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className={`rounded-2xl p-8 text-center border ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/70 border-gray-200 backdrop-blur-sm'
          } shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No posts yet
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {isOwnProfile ? 'Share your first post!' : `${user.name} hasn't posted anything yet.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;