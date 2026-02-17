# SocialFlow Pro - Social Media Management Platform

A comprehensive full-stack Social Media Management (SMM) web application built with the MERN stack. Manage all your social media accounts, schedule posts, analyze performance, and grow your audience from a single dashboard.

![SocialFlow Pro](https://via.placeholder.com/800x400?text=SocialFlow+Pro)

## Features

### Core Features
- **Multi-Platform Support**: Connect and manage Facebook, Instagram, Twitter, LinkedIn, YouTube, TikTok, and Pinterest accounts
- **Post Scheduler**: Schedule posts across multiple platforms with timezone support
- **Content Calendar**: Visual calendar view to manage scheduled content
- **Analytics Dashboard**: Track engagement, reach, followers, and performance metrics
- **Media Library**: Centralized storage for images and videos with Cloudinary integration
- **Real-time Previews**: Preview how posts will look on each platform before publishing

### Responsive Design
- **Mobile-First**: Fully responsive design optimized for all screen sizes
- **Adaptive Navigation**: Sidebar on desktop, bottom navigation on mobile
- **Touch-Friendly**: Optimized for touch interactions on mobile devices
- **Fluid Layouts**: Seamless experience across mobile, tablet, laptop, and desktop

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Recharts** - Data visualization charts
- **Axios** - HTTP client
- **date-fns** - Date manipulation utilities
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Passport.js** - OAuth authentication
- **Cloudinary** - Media storage and optimization
- **Multer** - File upload handling
- **Bcrypt.js** - Password hashing

## Project Structure

```
socialflow-pro/
├── src/                          # Frontend source
│   ├── components/               # React components
│   │   ├── layout/              # Layout components (Sidebar, Header, etc.)
│   │   └── ui/                  # UI components (shadcn)
│   ├── contexts/                # React contexts
│   ├── hooks/                   # Custom React hooks
│   ├── pages/                   # Page components
│   ├── services/                # API services
│   ├── types/                   # TypeScript types
│   └── utils/                   # Utility functions
├── backend/                      # Backend source
│   ├── config/                  # Configuration files
│   ├── controllers/             # Route controllers
│   ├── middleware/              # Express middleware
│   ├── models/                  # Mongoose models
│   ├── routes/                  # API routes
│   └── server.js                # Entry point
├── public/                       # Static assets
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/socialflow-pro.git
cd socialflow-pro
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

4. **Set up environment variables**
```bash
# Copy example env files
cp .env.example .env
cp backend/.env.example backend/.env

# Edit the .env files with your configuration
```

5. **Start MongoDB**
Make sure MongoDB is running on your system or use MongoDB Atlas.

6. **Run the development servers**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

7. **Open the application**
Navigate to `http://localhost:5173` in your browser.

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/socialflow
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
# ... see .env.example for all options
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/profile` - Update profile

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get single post
- `PATCH /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/publish` - Publish post
- `POST /api/posts/:id/schedule` - Schedule post

### Social Accounts
- `GET /api/accounts` - Get connected accounts
- `POST /api/accounts/connect` - Connect new account
- `POST /api/accounts/:id/disconnect` - Disconnect account
- `DELETE /api/accounts/:id` - Delete account

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard stats
- `GET /api/analytics` - Get analytics data
- `GET /api/analytics/posts/:id` - Get post analytics

### Media
- `GET /api/media` - Get media files
- `POST /api/media/upload` - Upload media
- `DELETE /api/media/:id` - Delete media

## Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1023px (md, lg)
- **Desktop**: 1024px+ (lg, xl)
- **Large Screens**: 1280px+ (xl, 2xl)

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
```
Deploy the `dist` folder to your hosting platform.

### Backend (Heroku/Railway/Render)
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
# Follow your hosting platform's deployment guide
```

### Full Stack (Docker)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@socialflow.pro or join our Slack channel.

## Roadmap

- [ ] AI-powered content suggestions
- [ ] Advanced analytics with ML insights
- [ ] Team collaboration features
- [ ] White-label solution
- [ ] Mobile app (React Native)
- [ ] Advanced scheduling with AI optimization

---

Built with ❤️ by the SocialFlow Pro Team
