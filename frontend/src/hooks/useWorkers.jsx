import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient'; // Asegúrate de que esta ruta sea correcta

const fetchWorkers = async () => {
  const { data } = await apiClient.get('/company/workers/'); // Ajusta la URL según tu API
  return data;
};

const useWorkers = () => {
  return useQuery('workers', fetchWorkers);
};

export default useWorkers;
