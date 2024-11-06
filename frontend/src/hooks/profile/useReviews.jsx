import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";
import { Identifiers } from "../tanstackIdentifiers";



export const useReviews = (queryParams = {}) => {


    const fetchReviews = async () => {

        console.log("Params en el hoook de useReviews: ", queryParams)
        const { data } = await apiClient.get("comments/", { params: queryParams });
        return data;
    }

    return useQuery(["Freelancer Comments", queryParams], fetchReviews, {
        staleTime: 1000 * 60 * 3,
        cachetime: 1000 * 60 * 30,
        retry: 2,
    })
}

export default useReviews;