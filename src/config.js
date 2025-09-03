export const config = {
  API_BASE: process.env.NODE_ENV === 'production' 
    ? 'https://smartrecipe-generator-be.onrender.com' 
    : 'http://localhost:8080',
  DEMO_USER_ID: 1  // This will be the demo user created on startup
};
