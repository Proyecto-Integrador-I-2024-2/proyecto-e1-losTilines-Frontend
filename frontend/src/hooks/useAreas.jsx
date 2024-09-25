import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const fetchAreas = async () => {
  const { data } = await apiClient.get("/company/areas/"); // Ajusta la URL según tu API
  return data;
};

export const useAreas = () => {
  return useQuery(["areas"], fetchAreas, {
    onError: (error) => {
      console.error("Error fetching areas:", error);
    },
  });
};

export default useAreas;