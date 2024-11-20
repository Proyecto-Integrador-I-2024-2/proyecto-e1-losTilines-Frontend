import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";
import { Identifiers } from "../tanstackIdentifiers";



const createArea = async (area) => {
  const { data } = await apiClient.post("areas/", area);
  return data;
};

export const useCreateArea = () => {

  const queryClient = useQueryClient();

  return useMutation(createArea, {
    onSuccess: (data) => {
      console.log("Area created:", data);
      queryClient.invalidateQueries(Identifiers.areas);
      queryClient.invalidateQueries(Identifiers.adminAvailables);

    },

    onError: (error) => {
      console.error("Area creation failed:", error.response.data);
    },
  });
};

export default useCreateArea;