import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient'; // Asegúrate de que esta ruta sea correcta

const fetchWorkersRoleArea = async () => {
  const { data } = await apiClient.get('/company/workers/rolesArealist/'); // Ajusta la URL según tu API
  return data;
};

export const useWorkersRoleArea = () => {
  return useQuery(['WorkersRoleArea'], fetchWorkersRoleArea);
};

export default useWorkersRoleArea;
