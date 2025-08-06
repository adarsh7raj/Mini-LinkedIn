const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');
require('dotenv').config();

const seedUsers = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'demo123',
    bio: 'Software Engineer passionate about building scalable web applications. Love React, Node.js, and cloud technologies.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'demo123',
    bio: 'Product Manager with 5+ years experience in tech startups. Currently building the future of fintech.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    name: 'Emma Davis',
    email: 'emma@example.com',
    password: 'demo123',
    bio: 'UX Designer creating beautiful and intuitive digital experiences. Advocate for accessible design.',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    name: 'David Wilson',
    email: 'david@example.com',
    password: 'demo123',
    bio: 'Data Scientist and ML Engineer. Turning data into insights and building intelligent systems.',
    avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

const seedPosts = [
  {
    content: 'Just shipped a new feature that reduces our API response time by 40%! The key was implementing Redis caching and optimizing our database queries. Performance optimization is such a rewarding challenge. #WebDev #Performance',
    authorEmail: 'alice@example.com'
  },
  {
    content: 'Excited to announce that our team just launched the new mobile app! 6 months of hard work, user research, and iterations. The user feedback has been incredible so far. Grateful for an amazing team! #ProductLaunch #TeamWork',
    authorEmail: 'bob@example.com'
  },
  {
    content: 'Working on a new design system for our company. The goal is to create consistent, accessible components that scale across all our products. Design systems are game-changers for product teams! #DesignSystems #UX',
    authorEmail: 'emma@example.com'
  },
  {
    content: 'Just finished training a machine learning model that can predict customer churn with 92% accuracy. The insights from this model will help our retention team proactively engage at-risk customers. Data science in action! #MachineLearning #DataScience',
    authorEmail: 'david@example.com'
  },
  {
    content: 'Attending an amazing tech conference today! The keynote on the future of web development was inspiring. Love connecting with other developers and learning about new technologies. #TechConference #Networking',
    authorEmail: 'alice@example.com'
  },
  {
    content: 'User research session today revealed some fascinating insights about how our customers actually use our product. Sometimes what users say and what they do are completely different! #UserResearch #ProductManagement',
    authorEmail: 'bob@example.com'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of seedUsers) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.name}`);
    }

    // Set up following relationships
    // Alice follows Bob and Emma
    createdUsers[0].following.push(createdUsers[1]._id, createdUsers[2]._id);
    createdUsers[1].followers.push(createdUsers[0]._id);
    createdUsers[2].followers.push(createdUsers[0]._id);

    // Bob follows David
    createdUsers[1].following.push(createdUsers[3]._id);
    createdUsers[3].followers.push(createdUsers[1]._id);

    // Emma follows Alice and David
    createdUsers[2].following.push(createdUsers[0]._id, createdUsers[3]._id);
    createdUsers[0].followers.push(createdUsers[2]._id);
    createdUsers[3].followers.push(createdUsers[2]._id);

    // Save updated users
    await Promise.all(createdUsers.map(user => user.save()));
    console.log('Set up following relationships');

    // Create posts
    for (const postData of seedPosts) {
      const author = createdUsers.find(user => user.email === postData.authorEmail);
      
      const post = new Post({
        content: postData.content,
        author: author._id
      });

      await post.save();
      console.log(`Created post by ${author.name}`);
    }

    // Add some likes to posts
    const posts = await Post.find({});
    
    // Alice's first post gets likes from Bob and Emma
    posts[0].likes.push(
      { user: createdUsers[1]._id },
      { user: createdUsers[2]._id }
    );
    
    // Bob's post gets likes from Alice and David
    posts[1].likes.push(
      { user: createdUsers[0]._id },
      { user: createdUsers[3]._id }
    );
    
    // Emma's post gets likes from Alice and Bob
    posts[2].likes.push(
      { user: createdUsers[0]._id },
      { user: createdUsers[1]._id }
    );
    
    // David's post gets likes from all users
    posts[3].likes.push(
      { user: createdUsers[0]._id },
      { user: createdUsers[1]._id },
      { user: createdUsers[2]._id }
    );

    await Promise.all(posts.map(post => post.save()));
    console.log('Added likes to posts');

    console.log('✅ Database seeded successfully!');
    console.log('\nDemo accounts:');
    console.log('- alice@example.com / demo123');
    console.log('- bob@example.com / demo123');
    console.log('- emma@example.com / demo123');
    console.log('- david@example.com / demo123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;