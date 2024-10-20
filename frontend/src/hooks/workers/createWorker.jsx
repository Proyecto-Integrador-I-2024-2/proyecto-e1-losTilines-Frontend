import apiClient from "@/services/apiClient";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Identifiers } from "../tanstackIdentifiers";

const postWorker = async (worker) => {
  const response = await apiClient.post("workers/", worker);
  return response.data;
};

export const useCreateWorker = () => {

    const queryClient = useQueryClient();


  return useMutation(postWorker, {
    onSuccess: () => {

    queryClient.invalidateQueries([Identifiers.workers]); // Refetch workers
    console.log("Worker created successfully.");

    },
    onError: (error) => {
      console.error("Error creating worker:", error);
    },
  });
};
