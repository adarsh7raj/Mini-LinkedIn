import React, { useState } from 'react';
import { Send, Image, Smile } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

const CreatePost: React.FC = () => {
  const [content, setContent] = useState('');
  const { user, createPost } = useAuth();
  const { isDark } = useTheme();

  const maxLength = 280;
  const remainingChars = maxLength - content.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please write something to share!');
      return;
    }
    if (content.length > maxLength) {
      toast.error('Post is too long!');
      return;
    }

    createPost(content.trim());
    setContent('');
    toast.success('Post shared successfully!');
  };

  if (!user) return null;

  return (
    <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-800/50 border-gray-700' 
        : 'bg-white/70 border-gray-200 backdrop-blur-sm'
    } shadow-lg`}>
      <div className="flex space-x-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
        />
        
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className={`w-full p-4 border rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              rows={3}
              maxLength={maxLength}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isDark 
                      ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-blue-500 hover:bg-gray-100'
                  }`}
                >
                  <Image size={18} />
                  <span className="text-sm">Photo</span>
                </button>
                
                <button
                  type="button"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isDark 
                      ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-yellow-500 hover:bg-gray-100'
                  }`}
                >
                  <Smile size={18} />
                  <span className="text-sm">Emoji</span>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <span className={`text-sm ${
                  remainingChars < 50 
                    ? 'text-red-500' 
                    : isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {remainingChars}
                </span>
                
                <button
                  type="submit"
                  disabled={!content.trim() || content.length > maxLength}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    !content.trim() || content.length > maxLength
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <Send size={16} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;