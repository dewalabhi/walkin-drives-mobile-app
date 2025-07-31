import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider } from './src/context/AuthContext';
import { useAuth } from './src/context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/candidate/HomeScreen';
import DriveDetailsScreen from './src/screens/candidate/DriveDetailsScreen';
import MyInterestsScreen from './src/screens/candidate/MyInterestsScreen';
import ProfileScreen from './src/screens/common/ProfileScreen';
import CompanyHomeScreen from './src/screens/company/CompanyHomeScreen';
import CreateDriveScreen from './src/screens/company/CreateDriveScreen';
import DriveManagementScreen from './src/screens/company/DriveManagementScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Candidate Tab Navigator
function CandidateTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'My Interests') iconName = 'favorite';
          else if (route.name === 'Profile') iconName = 'person';
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="My Interests" component={MyInterestsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Company Tab Navigator
function CompanyTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Drives') iconName = 'business';
          else if (route.name === 'Create') iconName = 'add-circle';
          else if (route.name === 'Manage') iconName = 'settings';
          else if (route.name === 'Profile') iconName = 'person';
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Drives" component={CompanyHomeScreen} />
      <Tab.Screen name="Create" component={CreateDriveScreen} />
      <Tab.Screen name="Manage" component={DriveManagementScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main Navigator
function AppNavigator() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return null; // Add loading screen here
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // Main App Stack
          <>
            {user.userType === 'candidate' ? (
              <>
                <Stack.Screen name="CandidateTab" component={CandidateTabNavigator} />
                <Stack.Screen name="DriveDetails" component={DriveDetailsScreen} />
              </>
            ) : (
              <Stack.Screen name="CompanyTab" component={CompanyTabNavigator} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
