# Setup Instructions for React Native

## Quick Setup (Recommended):

### 1. Create new React Native project:
```bash
cd C:\Users\WIN10\Downloads\Applications
npx react-native init WalkInDriveApp
cd WalkInDriveApp
```

### 2. Install dependencies:
```bash
npm install @react-native-async-storage/async-storage
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler
npm install @react-native-community/datetimepicker
npm install @react-native-picker/picker
npm install react-native-vector-icons
```

### 3. Replace App.js with our App.js
Copy the App.js from mobile/ folder to your new project

### 4. Copy src folder:
Copy the entire src/ folder from mobile/ to your new project

### 5. Update API URL:
Edit src/services/api.js and change:
```javascript
const BASE_URL = 'http://10.0.2.2:5000/api'; // For Android Emulator
// OR
const BASE_URL = 'http://YOUR_COMPUTER_IP:5000/api'; // For physical device
```

### 6. Android setup:
```bash
# Add to android/app/build.gradle
apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
```

### 7. Run the app:
```bash
npx react-native run-android
```

## Alternative: Use Expo (Easier):
```bash
npx create-expo-app WalkInDriveApp
cd WalkInDriveApp
# Then adapt the code for Expo
```
