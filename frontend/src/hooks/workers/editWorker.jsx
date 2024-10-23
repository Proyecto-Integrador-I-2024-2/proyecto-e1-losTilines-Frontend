import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";
import { Identifiers } from "../tanstackIdentifiers";

export const useEditWorker = () => {
  const queryClient = useQueryClient();

  // Función para realizar el PATCH al trabajador
  const patchWorker = async (workerData) => {
    const response = await apiClient.patch(`workers/${workerData.id}/`, workerData.data);
    return response.data;
  };

  // Configuración de la mutación
  return useMutation(patchWorker, {
    onSuccess: (data) => {
      console.log("Trabajador actualizado:", data);
      queryClient.invalidateQueries([Identifiers.workers]);
    },
    onError: (error) => {
      console.error("Error al actualizar el trabajador:", error);
    },
  });
};
