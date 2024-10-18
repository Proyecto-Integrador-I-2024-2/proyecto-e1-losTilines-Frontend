import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const createArea = async (area) => {
  const { data } = await apiClient.post("areas/", area);

  return data;
};

export const useCreateArea = () => {
  return useMutation(createArea, {
    onSuccess: (data) => {
      console.log("Area created:", data);
    },

    onError: (error) => {
      console.error("Area creation failed:", error.response.data);
    },
  });
};

export default useCreateArea;