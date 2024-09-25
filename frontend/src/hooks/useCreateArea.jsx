import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const createArea = async (area) => {
  const { data } = await apiClient.post("company/areas/create/", area);

  return data;
};

export const useCreateArea = () => {
  const queryClient = useQueryClient();

  return useMutation(createArea, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["areas"]);
      console.log("Area created:", data);
    },

    onError: (error) => {
      console.error("Area creation failed:", error.response.data);
      alert("Area creation failed! Check your data" + error.response.data);
    },
  });
};

export default useCreateArea;