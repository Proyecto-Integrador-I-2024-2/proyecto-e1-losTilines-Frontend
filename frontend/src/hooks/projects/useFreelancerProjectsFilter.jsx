import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';// Asegúrate de que esta ruta sea correcta
import { useFreelancerProjects } from '.';

// Función para obtener un proyecto por ID
const fetchProject = async (id) => {


  const { data } = await apiClient.get(`/projectsfreelancers/`, {params: {freelancer: id}} );
  console.log("Data from fetchProject", data, " id: ", id);
  return data;
};

// Hook personalizado para obtener un proyecto específico
export const useFreelancerProjectsFilter = (id) => {
  return useQuery(['projectFreelancer', id], () => fetchProject(id), {
    // Aquí puedes agregar opciones adicionales
    enabled: !!id, // La consulta solo se ejecuta si hay un ID válido
    retry: 1, // Reintentar una vez en caso de error
    onSuccess: (data) => {console.log("Success fetch of projects freelancer.") },
    onError: (error) => {
      console.error('Error fetching project:', error);
    },
  });
};

export default useFreelancerProjectsFilter;
