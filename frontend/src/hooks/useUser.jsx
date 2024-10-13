import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const fetchUser = async () => {
  const id = sessionStorage.getItem("id");
  var userType;

  if (sessionStorage.getItem("role") === "Freelancer") {
    userType = "freelancer";
  } else {
    userType = "workers";
  }

  const url = `${userType}/${id}/`;
  const { data } = await apiClient.get(url);
  return data;
};

export const useUser = () => {
  return useQuery(["User"], fetchUser, {
    staleTime: 1000 * 60 * 3,
    cachetime: 1000 * 60 * 30,
    retry: 2,
  });
};

export default useUser;
