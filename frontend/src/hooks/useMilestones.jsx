import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient'; 


const fetchMilestones = async () => {
  const { data } = await apiClient.get('/milestones/', {
    params: { project: projectId },
  });
  return data;
};


export const useMilestones = () => {
  return useQuery(['milestones'], fetchMilestones, {
    onError: (error) => {
        console.error("Error fetching milestones for this project", error)
    } 
  });
};

export default useMilestones;
      