import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { formatDistanceToNow } from '../utils/dateUtils';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user, getUserById, likePost } = useAuth();
  const { isDark } = useTheme();
  const author = post.author;

  if (!author || !user) return null;

  const isLiked = post.likes.some(like => like.user === user.id);

  const handleLike = () => {
    likePost(post.id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out this post: ${post.content}`);
  };

  return (
    <div className={`rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] border ${
      isDark 
        ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
        : 'bg-white/70 border-gray-200 hover:bg-white/90 backdrop-blur-sm'
    } shadow-lg hover:shadow-xl`}>
      {/* Author Info */}
      <div className="flex items-center space-x-3 mb-4">
        <Link to={`/profile/${author.id || author._id}`} className="flex-shrink-0">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md hover:ring-blue-300 transition-all duration-200"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link 
            to={`/profile/${author.id || author._id}`}
            className={`font-semibold hover:underline ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {author.name}
          </Link>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatDistanceToNow(post.createdAt)} ago
          </p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className={`text-base leading-relaxed ${
          isDark ? 'text-gray-100' : 'text-gray-800'
        }`}>
          {post.content}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              isLiked
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
                : `${isDark ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' : 'text-gray-500 hover:text-red-500 hover:bg-gray-50'}`
            }`}
          >
            <Heart size={18} className={isLiked ? 'fill-current' : ''} />
            <span className="text-sm font-medium">{post.likes.length}</span>
          </button>

          <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
            isDark 
              ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' 
              : 'text-gray-500 hover:text-blue-500 hover:bg-gray-50'
          }`}>
            <MessageCircle size={18} />
            <span className="text-sm font-medium">Comment</span>
          </button>
        </div>

        <button
          onClick={handleShare}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isDark 
              ? 'text-gray-400 hover:text-green-400 hover:bg-gray-700' 
              : 'text-gray-500 hover:text-green-500 hover:bg-gray-50'
          }`}
        >
          <Share size={18} />
        </button>
      </div>
    </div>
  );
};

export default PostCard;