import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';

const Home: React.FC = () => {
  const { posts, users, user } = useAuth();
  const { isDark } = useTheme();

  // Get following posts and suggested users
  const followingPosts = posts.filter(post => 
    user?.following.includes(post.author.id || post.author._id) || 
    (post.author.id || post.author._id) === user?.id
  );
  
  const allPosts = followingPosts.length > 0 ? followingPosts : posts;
  
  const suggestedUsers = users
    .filter(u => (u.id || u._id) !== user?.id && !user?.following.includes(u.id || u._id))
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Message */}
          <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/70 border-gray-200 backdrop-blur-sm'
          } shadow-lg`}>
            <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              What's happening in your network today?
            </p>
          </div>

          {/* Create Post */}
          <CreatePost />

          {/* Posts Feed */}
          <div className="space-y-6">
            {allPosts.length > 0 ? (
              allPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
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
                  Be the first to share something or follow some users to see their posts!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Stats */}
          <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/70 border-gray-200 backdrop-blur-sm'
          } shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Your Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Posts</span>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {posts.filter(p => (p.author.id || p.author._id) === user?.id).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Following</span>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user?.following.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Followers</span>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user?.followers.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Suggested Users */}
          {suggestedUsers.length > 0 && (
            <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
              isDark 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/70 border-gray-200 backdrop-blur-sm'
            } shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Suggested for you
              </h3>
              <div className="space-y-4">
                {suggestedUsers.map(suggestedUser => (
                  <UserCard key={suggestedUser.id || suggestedUser._id} userId={suggestedUser.id || suggestedUser._id} />
                ))}
              </div>
            </div>
          )}

          {/* Trending */}
          <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/70 border-gray-200 backdrop-blur-sm'
          } shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Trending Topics
            </h3>
            <div className="space-y-3">
              {['#ReactJS', '#WebDev', '#Photography', '#Travel', '#Design'].map((tag, index) => (
                <div key={tag} className="flex justify-between items-center">
                  <span className={`text-blue-600 dark:text-blue-400 hover:underline cursor-pointer`}>
                    {tag}
                  </span>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {Math.floor(Math.random() * 100) + 10}k posts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;