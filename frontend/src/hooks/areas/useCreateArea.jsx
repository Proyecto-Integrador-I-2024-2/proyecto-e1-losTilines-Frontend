import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";



const createArea = async (area) => {
  const { data } = await apiClient.post("areas/", area);
  return data;
};

export const useCreateArea = () => {

  const queryClient = useQueryClient();

  return useMutation(createArea, {
    onSuccess: (data) => {
      console.log("Area created:", data);
      queryClient.invalidateQueries("Areas");

    },

    onError: (error) => {
      console.error("Area creation failed:", error.response.data);
    },
  });
};

export default useCreateArea;