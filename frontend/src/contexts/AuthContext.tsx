import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, usersAPI, postsAPI } from '../services/api';
import { User, Post } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  posts: Post[];
  users: User[];
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, bio?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  createPost: (content: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  getUserById: (userId: string) => User | undefined;
  getPostsByUserId: (userId: string) => Post[];
  searchUsers: (query: string) => Promise<User[]>;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getMe();
          const userData = response.user;
          // Normalize user data
          const normalizedUser = {
            ...userData,
            id: userData._id || userData.id,
          };
          setUser(normalizedUser);
          await loadInitialData();
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loadInitialData = async () => {
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        postsAPI.getPosts(20, 1),
        usersAPI.getUsers('', 20, 1)
      ]);

      // Normalize posts data
      const normalizedPosts = postsResponse.posts?.map((post: any) => ({
        ...post,
        id: post._id || post.id,
        author: {
          ...post.author,
          id: post.author._id || post.author.id,
        }
      })) || [];

      // Normalize users data
      const normalizedUsers = usersResponse.users?.map((user: any) => ({
        ...user,
        id: user._id || user.id,
      })) || [];

      setPosts(normalizedPosts);
      setUsers(normalizedUsers);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user: userData } = response;
      
      localStorage.setItem('token', token);
      
      // Normalize user data
      const normalizedUser = {
        ...userData,
        id: userData._id || userData.id,
      };
      
      setUser(normalizedUser);
      localStorage.setItem('currentUser', JSON.stringify(normalizedUser));
      
      await loadInitialData();
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, bio = ''): Promise<boolean> => {
    try {
      const response = await authAPI.register(name, email, password, bio);
      const { token, user: userData } = response;
      
      localStorage.setItem('token', token);
      
      // Normalize user data
      const normalizedUser = {
        ...userData,
        id: userData._id || userData.id,
      };
      
      setUser(normalizedUser);
      localStorage.setItem('currentUser', JSON.stringify(normalizedUser));
      
      await loadInitialData();
      return true;
    } catch (error: any) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setPosts([]);
    setUsers([]);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const response = await usersAPI.updateProfile(updates);
      const updatedUser = {
        ...response.user,
        id: response.user._id || response.user.id,
      };
      
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update user in users list
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile');
    }
  };

  const createPost = async (content: string) => {
    if (!user) return;

    try {
      const response = await postsAPI.createPost(content);
      const newPost = {
        ...response.post,
        id: response.post._id || response.post.id,
        author: {
          ...response.post.author,
          id: response.post.author._id || response.post.author.id,
        }
      };
      
      setPosts(prev => [newPost, ...prev]);
    } catch (error) {
      console.error('Create post failed:', error);
      toast.error('Failed to create post');
    }
  };

  const likePost = async (postId: string) => {
    if (!user) return;

    try {
      await postsAPI.likePost(postId);
      
      // Optimistically update the UI
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const isLiked = post.likes.some(like => like.user === user.id);
          const newLikes = isLiked
            ? post.likes.filter(like => like.user !== user.id)
            : [...post.likes, { user: user.id, createdAt: new Date().toISOString() }];
          
          return { ...post, likes: newLikes };
        }
        return post;
      }));
    } catch (error) {
      console.error('Like post failed:', error);
      toast.error('Failed to like post');
    }
  };

  const followUser = async (userId: string) => {
    if (!user || userId === user.id) return;

    try {
      await usersAPI.followUser(userId);
      
      // Update current user's following
      const updatedUser = {
        ...user,
        following: [...user.following, userId]
      };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Update users list
      setUsers(prev => prev.map(u => {
        if (u.id === user.id) {
          return { ...u, following: [...u.following, userId] };
        }
        if (u.id === userId) {
          return { ...u, followers: [...u.followers, user.id] };
        }
        return u;
      }));
    } catch (error) {
      console.error('Follow user failed:', error);
      toast.error('Failed to follow user');
    }
  };

  const unfollowUser = async (userId: string) => {
    if (!user || userId === user.id) return;

    try {
      await usersAPI.unfollowUser(userId);
      
      // Update current user's following
      const updatedUser = {
        ...user,
        following: user.following.filter(id => id !== userId)
      };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Update users list
      setUsers(prev => prev.map(u => {
        if (u.id === user.id) {
          return { ...u, following: u.following.filter(id => id !== userId) };
        }
        if (u.id === userId) {
          return { ...u, followers: u.followers.filter(id => id !== user.id) };
        }
        return u;
      }));
    } catch (error) {
      console.error('Unfollow user failed:', error);
      toast.error('Failed to unfollow user');
    }
  };

  const getUserById = (userId: string): User | undefined => {
    return users.find(u => u.id === userId);
  };

  const getPostsByUserId = (userId: string): Post[] => {
    return posts.filter(p => p.author.id === userId || p.author._id === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const searchUsers = async (query: string): Promise<User[]> => {
    if (!query) return [];
    
    try {
      const response = await usersAPI.getUsers(query, 10, 1);
      return response.users?.map((user: any) => ({
        ...user,
        id: user._id || user.id,
      })) || [];
    } catch (error) {
      console.error('Search users failed:', error);
      return [];
    }
  };

  const refreshData = async () => {
    await loadInitialData();
  };

  const value = {
    user,
    posts,
    users,
    loading,
    login,
    register,
    logout,
    updateProfile,
    createPost,
    likePost,
    followUser,
    unfollowUser,
    getUserById,
    getPostsByUserId,
    searchUsers,
    refreshData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};