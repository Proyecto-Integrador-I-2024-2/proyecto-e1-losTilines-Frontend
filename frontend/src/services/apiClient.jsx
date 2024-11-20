import axios from 'axios';

console.log(import.meta.env.VITE_API_BASE_URL); // Verifica si la variable está disponible

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Usar `import.meta.env` en lugar de `process.env`
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default apiClient;
