import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient'; // Asegúrate de que esta ruta sea correcta

export const fetchFreelancerProjects = async (freelancerId) => {
    const { data } = await apiClient.get(`/projects/listing/freelancer/${freelancerId}`); // Ajusta la URL según tu API
    return data;
};

export const useFreelancerProjects = (freelancerId) => {
    return useQuery(['FreelancerProjects', freelancerId], () => fetchFreelancerProjects(freelancerId), {
        enabled: !!freelancerId
    });
};

export default useFreelancerProjects;
