import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient"; 

export const useCustomFethc = (identifier, urlFetch, queryParams) => {
  return useQuery(
    [identifier], // Clave única para la consulta
    async () => {
      if (urlFetch) {
        const response = await apiClient.get(urlFetch, {
          params: queryParams,
        });
        return response.data; // Devuelve los datos obtenidos
      }
      return null; // Devuelve null si no hay urlFetch
    },
    {
      enabled: !!urlFetch, // Solo se ejecuta si urlFetch es verdadero
    }
  );
};


