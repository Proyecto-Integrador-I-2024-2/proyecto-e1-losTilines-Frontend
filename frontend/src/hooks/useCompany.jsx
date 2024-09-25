import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const fetchCompany = async () => {

    const { data } = await apiClient.get("/profile/companies/1");
    return data;
}

export const useCompany = () => {

    return useQuery(['Company'], fetchCompany, {
        staleTime: 1000 * 60 * 3,
        cachetime: 1000 * 60 * 30,
        retry: 2
    })
}

export default useCompany;