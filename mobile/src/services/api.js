import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:5000/api'; // Change for production

class ApiService {
  async request(endpoint, options = {}) {
    const token = await AsyncStorage.getItem('userToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };
    
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  }
  
  // Auth endpoints
  authAPI = {
    login: (email, password) =>
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    
    register: (userData) =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
  };
  
  // Drives endpoints
  drivesAPI = {
    getDrives: (filters = {}) => {
      const queryParams = new URLSearchParams(filters).toString();
      return this.request(`/drives?${queryParams}`);
    },
    
    getDrive: (id) => this.request(`/drives/${id}`),
    
    createDrive: (driveData) =>
      this.request('/drives', {
        method: 'POST',
        body: JSON.stringify(driveData),
      }),
    
    updateDrive: (id, driveData) =>
      this.request(`/drives/${id}`, {
        method: 'PUT',
        body: JSON.stringify(driveData),
      }),
    
    getMyDrives: () => this.request('/drives/company/my-drives'),
  };
  
  // Interest endpoints
  interestAPI = {
    expressInterest: (driveId) =>
      this.request(`/interest/${driveId}`, { method: 'POST' }),
    
    withdrawInterest: (driveId) =>
      this.request(`/interest/${driveId}`, { method: 'DELETE' }),
    
    getMyInterests: () => this.request('/interest/my-interests'),
    
    getDriveCandidates: (driveId) =>
      this.request(`/interest/drive/${driveId}/candidates`),
    
    checkInterest: (driveId) => this.request(`/interest/check/${driveId}`),
  };
}

const apiService = new ApiService();
export const { authAPI, drivesAPI, interestAPI } = apiService;