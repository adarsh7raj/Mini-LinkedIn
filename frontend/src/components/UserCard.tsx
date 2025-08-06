import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface UserCardProps {
  userId: string;
}

const UserCard: React.FC<UserCardProps> = ({ userId }) => {
  const { user: currentUser, users, followUser, unfollowUser } = useAuth();
  const { isDark } = useTheme();
  const user = users.find(u => u.id === userId || u._id === userId);

  if (!user || !currentUser || (user.id || user._id) === currentUser.id) return null;

  const isFollowing = currentUser.following.includes(user.id || user._id);

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser(user.id || user._id);
    } else {
      followUser(user.id || user._id);
    }
  };

  return (
    <div className={`rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] ${
      isDark 
        ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
        : 'bg-white/70 border-gray-200 hover:bg-white/90 backdrop-blur-sm'
    } shadow-lg hover:shadow-xl`}>
      <div className="flex items-center space-x-4">
        <Link to={`/profile/${user.id || user._id}`} className="flex-shrink-0">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-md hover:ring-blue-300 transition-all duration-200"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          <Link
            to={`/profile/${user.id || user._id}`}
            className={`text-lg font-semibold hover:underline ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {user.name}
          </Link>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>
            {user.bio}
          </p>
          <div className={`flex items-center space-x-4 mt-2 text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <span>{user.followers.length} followers</span>
            <span>{user.following.length} following</span>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default UserCard;