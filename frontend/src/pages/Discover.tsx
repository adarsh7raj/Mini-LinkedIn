import React, { useState } from 'react';
import { Search, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import UserCard from '../components/UserCard';
import PostCard from '../components/PostCard';

const Discover: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { searchUsers, posts, users } = useAuth();
  const { isDark } = useTheme();

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query) {
      const results = await searchUsers(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const popularPosts = posts.slice(0, 5).sort((a, b) => b.likes.length - a.likes.length);
  const allUsers = users.slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className={`rounded-2xl p-6 mb-8 border transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white/70 border-gray-200 backdrop-blur-sm'
      } shadow-lg`}>
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Discover
        </h1>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Find new people to connect with and explore trending content
        </p>
      </div>

      {/* Search */}
      <div className={`rounded-2xl p-6 mb-8 border transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white/70 border-gray-200 backdrop-blur-sm'
      } shadow-lg`}>
        <div className="relative">
          <Search className={`absolute left-3 top-3 h-5 w-5 ${
            isDark ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for users..."
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mt-6">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Search Results ({searchResults.length})
            </h3>
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map(user => (
                  <UserCard key={user.id} userId={user.id} />
                ))}
              </div>
            ) : (
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No users found matching "{searchQuery}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      {!searchQuery && (
        <div className={`rounded-2xl border transition-colors duration-300 ${
          isDark 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white/70 border-gray-200 backdrop-blur-sm'
        } shadow-lg overflow-hidden mb-8`}>
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-colors duration-200 ${
                activeTab === 'users'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-400'
                  : `${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
              }`}
            >
              <Users size={20} />
              <span>People</span>
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-colors duration-200 ${
                activeTab === 'posts'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-400'
                  : `${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
              }`}
            >
              <TrendingUp size={20} />
              <span>Trending</span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'users' ? (
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Suggested People
                </h3>
                <div className="space-y-4">
                  {allUsers.map(user => (
                    <UserCard key={user.id} userId={user.id} />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Popular Posts
                </h3>
                <div className="space-y-6">
                  {popularPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trending Topics */}
      {!searchQuery && (
        <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
          isDark 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white/70 border-gray-200 backdrop-blur-sm'
        } shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Trending Topics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { tag: '#ReactJS', posts: '124k', growth: '+12%' },
              { tag: '#WebDev', posts: '89k', growth: '+8%' },
              { tag: '#Photography', posts: '67k', growth: '+15%' },
              { tag: '#Travel', posts: '54k', growth: '+5%' },
              { tag: '#Design', posts: '43k', growth: '+22%' },
              { tag: '#Coding', posts: '38k', growth: '+18%' }
            ].map((topic, index) => (
              <div
                key={topic.tag}
                className={`p-4 rounded-xl border transition-all duration-200 hover:scale-105 cursor-pointer ${
                  isDark 
                    ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' 
                    : 'bg-gray-50 border-gray-200 hover:bg-white'
                } shadow-sm hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    {topic.tag}
                  </span>
                  <span className="text-green-500 text-sm font-medium">
                    {topic.growth}
                  </span>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {topic.posts} posts
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;