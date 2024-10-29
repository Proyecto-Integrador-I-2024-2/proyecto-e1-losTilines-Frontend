import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";
import { Identifiers } from "../tanstackIdentifiers";



export const useProjects = (queryParams = {}) => {


    const fetchProjects = async () => {

        console.log("Params en el hoook: ",queryParams)
        const { data } = await apiClient.get("projects/", { params: queryParams });    
        return data;
    }

    return useQuery([Identifiers.project], fetchProjects, {
        staleTime: 1000 * 60 * 3,
        cachetime: 1000 * 60 * 30,
        retry: 2,
    })
}

export default useProjects;