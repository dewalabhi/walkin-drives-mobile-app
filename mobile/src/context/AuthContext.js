import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        user: action.user,
        token: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...state,
        user: action.user,
        token: action.token,
        isLoading: false,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');
        
        if (token && userData) {
          dispatch({
            type: 'RESTORE_TOKEN',
            token,
            user: JSON.parse(userData),
          });
        } else {
          dispatch({ type: 'RESTORE_TOKEN', token: null, user: null });
        }
      } catch (e) {
        dispatch({ type: 'RESTORE_TOKEN', token: null, user: null });
      }
    };
    
    bootstrapAsync();
  }, []);
  
  const authContext = {
    signIn: async (email, password) => {
      try {
        const response = await authAPI.login(email, password);
        
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        
        dispatch({
          type: 'SIGN_IN',
          token: response.token,
          user: response.user,
        });
        
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    signUp: async (userData) => {
      try {
        const response = await authAPI.register(userData);
        
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        
        dispatch({
          type: 'SIGN_IN',
          token: response.token,
          user: response.user,
        });
        
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    signOut: async () => {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      dispatch({ type: 'SIGN_OUT' });
    },
    
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
  };
  
  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);