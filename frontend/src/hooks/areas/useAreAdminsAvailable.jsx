import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";
import { Identifiers } from "../tanstackIdentifiers";

const fetchAdminsAvailable = async () => {
  const { data } = await apiClient.get("admin-areas/", {

    params: {area: "none"},

  }); 
  return data;
};

export const useAdminAvailables = () => {

  const queryClient = useQueryClient();
  return useQuery([Identifiers.adminAvailables], fetchAdminsAvailable, {
    
    onSuccess: () => {

      console.log("Admins availables fetched successfully")
      
    },

    onError: (error) => {
      console.error("Error fetching admins availables:", error);
    }
  });
};
