export const config = {
  API_BASE: import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.MODE === 'production' 
      ? 'https://smartrecipe-generator-be.onrender.com' 
      : 'http://localhost:8080'),
  DEMO_USER_ID: 1  // This will be the demo user created on startup
};
