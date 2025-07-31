# Windows MongoDB Setup Guide

## Option 1: MongoDB Community Server (Recommended)

### Download & Install:
1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (7.0.x)
   - Platform: Windows x64
   - Package: MSI
3. Download and run the installer
4. During installation:
   - Choose "Complete" setup
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool)

### Start MongoDB Service:
```cmd
# Check if service is running
net start MongoDB

# If not running, start it
net start MongoDB

# To stop (if needed)
net stop MongoDB
```

### Test Connection:
```cmd
# Open Command Prompt and test
mongosh
# You should see: "test>"
```

## Option 2: Using Chocolatey (If you have it)
```cmd
choco install mongodb
```

## Option 3: Using Docker (Cross-platform)
```cmd
# Install Docker Desktop first, then:
docker run --name mongodb -d -p 27017:27017 mongo:latest

# To start container later:
docker start mongodb

# To stop container:
docker stop mongodb
```

## Local Connection String:
```
MONGODB_URI=mongodb://localhost:27017/walkin-drives
```

## MongoDB Compass (GUI):
- Open MongoDB Compass
- Connect to: mongodb://localhost:27017
- Create database: "walkin-drives"
- Collections will be created automatically by your app
