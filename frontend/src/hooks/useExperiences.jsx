import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const fetchUserExperiences = async (userId) => {
  const { data } = await apiClient.get(`/profile/experience/${userId}`);
  return data;
};

export const useExperiences = (userId) => {
  return useQuery(["Experience", userId], () => fetchUserExperiences(userId), {
    cachetime: 1000 * 60 * 30,
    retry: 2,
    enabled: !!userId,
  });
};

export default useExperiences;
