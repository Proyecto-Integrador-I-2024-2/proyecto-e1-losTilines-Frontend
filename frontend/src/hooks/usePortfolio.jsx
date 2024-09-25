import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const fetchPortfolio = async (userId) => {

    const { data } = await apiClient.get(`/profile/portfolio/${userId}`);
    return data;
}

export const usePortfolio = (userId) => {

    return useQuery(['Portfolio', userId], () => fetchPortfolio(userId), {
        staleTime: 1000 * 60 * 3,
        cachetime: 1000 * 60 * 30,
        retry: 2,
        enabled: !!userId
    })
}

export default usePortfolio;