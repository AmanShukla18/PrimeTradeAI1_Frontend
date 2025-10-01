// API Configuration using environment variables
const getApiBaseUrl = () => {
  // Use environment variable if available, otherwise fallback to defaults
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Fallback based on NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    return 'https://your-backend-app.vercel.app'; // Replace with your actual Vercel backend URL
  }
  
  return 'http://localhost:5000';
};

export const API_CONFIG = {
  API_BASE_URL: getApiBaseUrl(),
  TIMEOUT: 30000,
  ENVIRONMENT: process.env.NODE_ENV || 'development'
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.API_BASE_URL}${endpoint}`;
};

// Log configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:', {
    baseUrl: API_CONFIG.API_BASE_URL,
    environment: API_CONFIG.ENVIRONMENT
  });
}

// Default export for backward compatibility
export default API_CONFIG;