import { useQuery } from '@tanstack/react-query';
import apiClient from '../../services/apiClient'; // Asegúrate de que esta ruta sea correcta

// Función para obtener los proyectos de un freelancer por ID
const fetchFreelancerProjects = async (id) => {
  const { data } = await apiClient.get(`/projects/?freelancer=${id}`);
  return data;
};

// Hook personalizado para obtener los proyectos de un freelancer
export const useFreelancerProjects = () => {
  const id = sessionStorage.getItem("id");
  
  return useQuery(['freelancer_projects', id], () => fetchFreelancerProjects(id), {
    retry: 1, // Reintentar una vez en caso de error
    onError: (error) => {
      console.error('Error fetching freelancer projects:', error);
    },
  });
};
