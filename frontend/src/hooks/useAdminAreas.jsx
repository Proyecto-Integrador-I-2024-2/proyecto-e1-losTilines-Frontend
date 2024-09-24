import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const fetchAdminUser = async () => {

    const { data } = await apiClient.get("/company/workers/admin/available/");
    return data;
}

export const useAdminAreas = () => {

    return useQuery(['AdminUser'], fetchAdminUser, {
        staleTime: 1000 * 60 * 3,
    })
}

export default useAdminAreas;