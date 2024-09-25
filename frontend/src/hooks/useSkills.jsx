import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const fetchUserSkills = async (userId) => {

    const { data } = await apiClient.get(`/profile/skills/${userId}`);
    return data;
}

export const useSkills = (userId) => {

    return useQuery(['Skill', userId], () => fetchUserSkills(userId), {
        cachetime: 1000 * 60 * 30,
        retry: 2,
        enabled: !!userId
    })
}

export default useSkills;