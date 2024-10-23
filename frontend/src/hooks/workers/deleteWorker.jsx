import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";
import { Identifiers } from "../tanstackIdentifiers";

export const useDeleteWorker = () => {
    const queryClient = useQueryClient();


  return useMutation(
    async (id) => {
      const response = await apiClient.delete(`workers/${id}/`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([Identifiers.workers]); // Refetch workers
        console.log("Trabajador eliminado.");
      },
      onError: (error) => {
        console.error("Error al eliminar el trabajador:", error);
      },
    }
  );
};


