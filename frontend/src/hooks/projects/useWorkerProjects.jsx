import { useQuery } from '@tanstack/react-query';
import apiClient from '../../services/apiClient'; // Asegúrate de que esta ruta sea correcta

// Función para obtener los proyectos de un freelancer por ID
const fetchWorkerProjects = async (id) => {
  const { data } = await apiClient.get(`/projects?worker=${id}`);
  return data;
};

// Hook personalizado para obtener los proyectos de un freelancer
export const useWorkerProjects = () => {
  const id = sessionStorage.getItem("id");

  return useQuery(['worker_projects', id], () => fetchWorkerProjects(id), {
    retry: 1, // Reintentar una vez en caso de error
    onError: (error) => {
      console.error('Error fetching worker projects:', error);
    },
  });
};
