import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const fetchFreelancers = async () => {

    var userType = "freelancer";

    const url = `${userType}/`

    console.log("URL: " + url)
    const { data } = await apiClient.get(url);
    console.log("Despues del await ")
    return data;
}

export const useFreelancers = () => {

    return useQuery(['freelancersListing'], fetchFreelancers, {
        staleTime: 1000 * 60 * 3,
        cachetime: 1000 * 60 * 30,
        retry: 2,
    })
}

export default useFreelancers;