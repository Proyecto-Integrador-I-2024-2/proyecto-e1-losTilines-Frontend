import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";
import { Identifiers } from "../tanstackIdentifiers";


export const useWorkers = (params = {}, options = {}) => {
  // Filtrar parámetros para eliminar valores nulos o indefinidos
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value != null)
  );

  return useQuery(
    [Identifiers.workers, params], // Incluir parámetros en la clave de consulta
    async () => {
      const { data } = await apiClient.get("workers/", {
        params: filteredParams, // Pasar los parámetros filtrados
      });
      return data;  
    },
    {
      onSuccess: options.onSuccess, // Manejar éxito
      onError: options.onError,     // Manejar errores
      keepPreviousData: true,       // Mantener datos anteriores mientras se cargan nuevos
      staleTime: 5 * 60 * 1000,     // Tiempo en milisegundos antes de que los datos se consideren obsoletos
      cacheTime: 30 * 60 * 1000,    // Tiempo en milisegundos que los datos se mantienen en caché
    }
  );
};
