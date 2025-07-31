# Walk-in Drive App 🚀

> A mobile application connecting companies with job candidates through walk-in drives

## 🎯 Features

- **📱 Simple Interest Expression**: One-click "+" button for candidates to show interest
- **🏢 Company Drive Management**: Easy posting and management of walk-in drives
- **👥 Candidate Discovery**: Browse drives with smart filtering
- **📍 Location-Based Filtering**: Find drives near you
- **🔍 Job Category Filtering**: Filter by technology, HR, finance, etc.
- **⚡ Real-time Updates**: Instant interest notifications
- **🔐 Secure Authentication**: JWT-based user management
- **📊 Interest Analytics**: Track candidate engagement

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - REST API
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Mobile App
- **React Native** - Cross-platform mobile development
- **React Navigation** - Navigation management
- **AsyncStorage** - Local data persistence
- **Vector Icons** - Beautiful UI icons

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- React Native development environment
- Android Studio / Xcode (for device testing)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start development server
npm run dev
```

### Mobile App Setup

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# For iOS (Mac only)
cd ios && pod install && cd ..

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```

## 📱 App Structure

```
walkin-drives-mobile-app/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Express server
├── mobile/
│   ├── src/
│   │   ├── screens/     # App screens
│   │   │   ├── auth/    # Login/Register
│   │   │   ├── candidate/ # Job seeker screens
│   │   │   └── company/ # Company screens
│   │   ├── context/     # React Context (Auth)
│   │   └── services/    # API services
│   └── App.js           # Main app component
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Drives
- `GET /api/drives` - Get all drives (with filters)
- `GET /api/drives/:id` - Get single drive
- `POST /api/drives` - Create drive (company only)
- `GET /api/drives/company/my-drives` - Get company drives

### Interest Management
- `POST /api/interest/:driveId` - Express interest
- `DELETE /api/interest/:driveId` - Withdraw interest
- `GET /api/interest/my-interests` - Get candidate interests
- `GET /api/interest/drive/:driveId/candidates` - Get interested candidates

## 🎨 User Flows

### For Job Candidates
1. **Register/Login** as candidate
2. **Browse drives** with location and job filters
3. **View drive details** - company info, requirements, etc.
4. **Express interest** with simple "+" button
5. **Track applications** in "My Interests" tab

### For Companies
1. **Register/Login** as company
2. **Create walk-in drives** with all details
3. **Manage posted drives** and view status
4. **View interested candidates** with contact info
5. **Track engagement** analytics

## 🌟 Key Advantages

- **Guaranteed Visibility**: Unlike social media posts, every drive is visible to all active job seekers
- **Targeted Audience**: Only people actively looking for jobs use the app
- **Real-time Engagement**: Companies get immediate interest notifications
- **Simple UX**: One-click interest expression removes friction
- **Local Focus**: Location-based filtering for relevant opportunities

## 🔧 Environment Variables

```bash
# Backend .env
MONGODB_URI=mongodb://localhost:27017/walkin-drives
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

## 📦 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Deploy backend code
3. Update MongoDB connection string

### Mobile App Deployment
1. Update API URL in `mobile/src/services/api.js`
2. Generate signed APK/IPA
3. Publish to Play Store/App Store

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abhi Dewal** - [@dewalabhi](https://github.com/dewalabhi)

## 🙏 Acknowledgments

- React Native community for excellent documentation
- MongoDB team for the flexible database
- All contributors who help improve this project

---

⭐ **Star this repo if you find it helpful!** ⭐