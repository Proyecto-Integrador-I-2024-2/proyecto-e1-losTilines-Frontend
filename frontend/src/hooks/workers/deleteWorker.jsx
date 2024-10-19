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
        console.log("Trabajador eliminado:", currentWorker.id);
        queryClient.invalidateQueries([Identifiers.workers]); // Refetch workers
        setOpenConfirmDelete(false);
        setOpen(false);
        // Opcional: mostrar un mensaje de éxito o redirigir al usuario
      },
      onError: (error) => {
        console.error("Error al eliminar el trabajador:", error);
        setErrorMessage(
          error.response?.data?.message ||
            "Hubo un error al eliminar el trabajador."
        );
      },
    }
  );
};


