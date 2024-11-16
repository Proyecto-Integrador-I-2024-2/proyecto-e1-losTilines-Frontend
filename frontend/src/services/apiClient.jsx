import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://freelancenow.azurewebsites.net/api/',  
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');  // Aquí obtenemos el token
  if (token) {
    config.headers.Authorization = `Token ${token}`;  // Agregamos el token en las cabeceras
  }
  return config;
});

export default apiClient;
