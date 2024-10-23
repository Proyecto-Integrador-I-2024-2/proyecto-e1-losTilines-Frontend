import { useQuery } from '@tanstack/react-query';
import apiClient from '../../services/apiClient';

const fetchProjectMilestones = async (id) => {
  const { data } = await apiClient.get(`/milestones/?project=${id}`);
  console.log("Data fetched from API:", data); // Verifica los datos que estás recibiendo
  return data;
};

export const useProjectMilestones = () => {
  const id = sessionStorage.getItem("id");
  
  console.log("Project ID:", id); // Verifica que el id sea correcto

  return useQuery(['worker_projects', id], () => fetchProjectMilestones(id), {
    retry: 1,
    onError: (error) => {
      console.error('Error fetching milestones projects:', error);
    },
    onSuccess: (data) => {
      console.log("Milestones fetched successfully:", data); // Verifica los datos en la consola
    }
  });
};
