import { useQuery } from '@tanstack/react-query';
import apiClient from '../../services/apiClient'; // Asegúrate de que esta ruta sea correcta

// Función para obtener un proyecto por ID
const fetchProject = async (id) => {
  const { data } = await apiClient.get(`/projects/${id}`);
  return data;
};

// Hook personalizado para obtener un proyecto específico
export const useProject = (id) => {
  return useQuery(['project', id], () => fetchProject(id), {
    // Aquí puedes agregar opciones adicionales
    enabled: !!id, // La consulta solo se ejecuta si hay un ID válido
    retry: 1, // Reintentar una vez en caso de error
    onError: (error) => {
      console.error('Error fetching project:', error);
    },
  });
};

export default useProject;
