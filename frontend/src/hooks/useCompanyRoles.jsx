import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const fetchCompanyRoles = async () => {

    const { data } = await apiClient.get("/company/groups/");
    return data;
}

export const useCompanyRoles = () => {

    return useQuery(['CompanyRoles'], fetchCompanyRoles, {
        staleTime: 1000 * 60 * 6,
        cachetime: 1000 * 60 * 30,
        retry: 2,
        placeholderData: []
    })
}

export default useCompanyRoles;