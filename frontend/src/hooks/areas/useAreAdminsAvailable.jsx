import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const fetchAdminsAvailable = async () => {
  const { data } = await apiClient.get("admin-areas/", {

    params: {area: "none"},

  }); 
  return data;
};

export const useAdminAvailables = () => {
  return useQuery(["AdminAvailables"], fetchAdminsAvailable, {
    onError: (error) => {
      console.error("Error fetching admins availables:", error);
    }
  });
};
