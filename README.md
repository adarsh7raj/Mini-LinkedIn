# Mini LinkedIn Community Platform

A full-stack social media platform inspired by LinkedIn, built with modern web technologies. This application provides a professional networking experience with user authentication, post sharing, and community interaction features.

## Live link:
(https://mini-linked-in-one.vercel.app/)

## 🌟 Features

### Core Features
- **User Authentication**: Secure registration and login with email/password
- **User Profiles**: Comprehensive profiles with name, email, bio, and profile pictures
- **Post Feed**: Create, read, and display text-only posts with timestamps
- **Profile Pages**: View individual user profiles and their posts
- **Protected Routes**: Secure frontend and backend route protection

### Additional Features Added
- **Follow/Unfollow System**: Build your professional network
- **Like/Unlike Posts**: Engage with community content
- **User Discovery**: Search and discover new professionals
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Real-time Updates**: Optimistic UI updates for seamless interaction
- **Responsive Design**: Mobile-first design that works on all devices
- **Toast Notifications**: Real-time feedback for user actions
- **User Statistics**: View follower/following counts and post metrics
- **Trending Topics**: Discover popular hashtags and topics
- **Character Limit**: Professional 1000-character limit for posts
- **Profile Editing**: Update your professional information
- **Demo Login**: Quick access with pre-configured demo accounts

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing with protected routes
- **Axios** - HTTP client for API communication
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Modern icon library
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation and sanitization
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Express Rate Limit** - Rate limiting middleware

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server auto-restart
- **dotenv** - Environment variable management

## 📸 Screenshots

### Login Page

##<img width="1919" height="1018" alt="Screenshot 2025-08-07 002659" src="https://github.com/user-attachments/assets/95c31f50-5a69-4692-ac46-7e09c1240200" />
*Beautiful login interface*


### Register Page

<img width="1740" height="1009" alt="Screenshot 2025-08-07 004612" src="https://github.com/user-attachments/assets/80e6d544-548a-434a-afbe-9b1c5fc99179" />

*Beautiful Register interface*

# Home Feed

<img width="1892" height="999" alt="Screenshot 2025-08-07 002801" src="https://github.com/user-attachments/assets/39d6b3b0-cd4a-4b78-a931-295debcf2b87" />

*Professional post feed with user interactions*

### Profile Page

<img width="1919" height="995" alt="Screenshot 2025-08-07 002857" src="https://github.com/user-attachments/assets/da1f6266-20ff-428f-acca-3b910c4b1ea1" />

*Comprehensive user profiles with post history*


###  Responsive design
<img width="759" height="1060" alt="Screenshot 2025-08-07 004019" src="https://github.com/user-attachments/assets/3dd790c3-1f00-431a-b850-7b2f0c10c019" />


*Fully responsive design for all devices*

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/adarsh7raj/Mini-LinkedIn
   
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the `server` directory:
   ```env
   # Database Configuration
   MONGODB_URI=your mongodb instance
   # JWT Configuration
   JWT_SECRET=your-super-secret
   JWT_EXPIRE=7d

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Client Configuration
   CLIENT_URL=http://localhost:5173
   ```


4. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd .. # Go back to root directory
   cd frontend
   npm install
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000




## 🎯 Demo Accounts

The application comes with pre-seeded demo accounts for testing:

| Email | Password | Role |
|-------|----------|------|
| alice@example.com | demo123 | Software Engineer |
| bob@example.com | demo123 | Product Manager |
| emma@example.com | demo123 | UX Designer |
| david@example.com | demo123 | Data Scientist |

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (with search)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/:id/follow` - Follow/unfollow user
- `GET /api/users/:id/posts` - Get user's posts

### Posts
- `GET /api/posts` - Get all posts (feed)
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts/:id/like` - Like/unlike post

## 🎨 Design Features

### UI/UX Highlights
- **Glass Morphism**: Modern frosted glass effects
- **Gradient Backgrounds**: Beautiful color transitions
- **Micro-interactions**: Smooth hover and click animations
- **Typography**: Professional font hierarchy
- **Color System**: Consistent primary, secondary, and accent colors
- **Spacing System**: 8px grid system for perfect alignment
- **Shadow System**: Layered shadows for depth perception

### Responsive Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for specific origins
- **Helmet Security**: Security headers for Express
- **XSS Protection**: Input sanitization and validation

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use a process manager like PM2
3. Configure reverse proxy (nginx)
4. Enable HTTPS with SSL certificates

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Configure environment variables for production API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request


## 🙏 Acknowledgments

- Design inspiration from LinkedIn and modern social platforms
- Icons provided by Lucide React
- Stock photos from Pexels
- MongoDB Atlas for database hosting

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact: adarshrajyadav68@gmail.com

---

**Built with ❤️ using React, Node.js, and MongoDB**
