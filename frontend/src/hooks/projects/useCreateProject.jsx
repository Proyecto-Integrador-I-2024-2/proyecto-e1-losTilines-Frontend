import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const createProject = async (project) => {
  const { data } = await apiClient.post("projects/", project);

  return data;
};

export const useCreateProject = () => {

  return useMutation(createProject, {
    onSuccess: (data) => {
      console.log("Project created:", data);
    },

    onError: (error) => {
      console.error("Project creation failed:", error.response.data);
    },
  });
};

export default useCreateProject;