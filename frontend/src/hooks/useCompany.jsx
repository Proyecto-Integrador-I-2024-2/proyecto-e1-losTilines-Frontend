import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const fetchCompany = async () => {
    console.log("Role: " + sessionStorage.getItem("role"))
    console.log("Id: " + sessionStorage.getItem("id"))
    console.log("Token: " + sessionStorage.getItem("token"))

    const id = sessionStorage.getItem("id");

    var userType = "company";

    const url = `${userType}/?userId=${id}`

    console.log("URL: " + url)
    const { data } = await apiClient.get(url);
    console.log("Despues del await ")
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