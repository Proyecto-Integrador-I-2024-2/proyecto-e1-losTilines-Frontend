import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const fetchUser  = async () =>{

    const {data}  = await apiClient.get("/profile/info/");
    return data;
}

export const useUser = () => {

    return useQuery(['User'], fetchUser, {
        staleTime: 1000 * 60 * 3,
        cachetime: 1000 * 60 * 30,
        retry: 2
    })
}

export default useUser;