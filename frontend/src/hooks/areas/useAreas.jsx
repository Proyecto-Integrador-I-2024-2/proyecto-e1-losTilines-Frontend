// src/hooks/useAreas.js

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";
import { Identifiers } from "../tanstackIdentifiers";

export const useAreas = (queryParams = {}, options = {}) => {

  console.log("Query params:", queryParams);

  return useQuery(
    [Identifiers.areas],
    async () => {

      const { data } = await apiClient.get("areas/", { params: queryParams });
      return data;
    },

    {
      onSuccess: (data) => {
        console.log("Areas success:", data);
      }

    }
    ,
    {
      onError: (error) => {
        console.error("Error while fetching areas:", error);
        
      },
      staleTime: 5 * 60 * 1000, // 5 minuts
      cacheTime: 30 * 60 * 1000, // 30 minuts
      retry: 2, 
    }
  );
};

export default useAreas;
