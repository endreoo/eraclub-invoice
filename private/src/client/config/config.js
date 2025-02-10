const config = {
  apiUrl: import.meta.env.PROD ? '' : import.meta.env.VITE_API_URL || '',
  baseUrl: import.meta.env.PROD ? window.location.origin : import.meta.env.VITE_BASE_URL || '',
};

export default config; 