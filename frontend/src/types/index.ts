export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  followers: string[];
  following: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface Post {
  id: string;
  _id?: string;
  content: string;
  author: {
    _id: string;
    id?: string;
    name: string;
    email: string;
    avatar: string;
    bio?: string;
  };
  likes: Array<{
    user: string;
    createdAt: string;
  }>;
  comments: Array<{
    _id: string;
    user: {
      _id: string;
      name: string;
      email: string;
      avatar: string;
    };
    content: string;
    createdAt: string;
  }>;
  likeCount?: number;
  commentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  posts?: Post[];
  users?: User[];
  user?: User;
  post?: Post;
  pagination?: {
    current: number;
    pages: number;
    total: number;
  };
}