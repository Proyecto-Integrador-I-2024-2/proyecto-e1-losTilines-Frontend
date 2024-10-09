import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const fetchUser = async () => {


    console.log("Role: " + sessionStorage.getItem("role"))
    console.log("Id: " + sessionStorage.getItem("id"))
    console.log("Token: " +sessionStorage.getItem("token"))

    const id = sessionStorage.getItem("id");


    //Define routes base on session storage, also be careful with the name of the id retriev
    //from freelancers, well, they are from a different table.

    var userType;

    if(sessionStorage.getItem("role") === "Business Manager") userType = "business-managers";
    if(sessionStorage.getItem("role") === "Project Manager") userType = "project-managers";
    if(sessionStorage.getItem("role") === "Area Admin") userType = "admin-areas";
    if(sessionStorage.getItem("role") === "Freelancer") userType = "freelancers";   

    const url  = `${userType}/${id}/`

    console.log("URL: " + url)
    const{data} = await apiClient.get(url);
    console.log("Despues del await ")   
    return data;
}

export const useUser = () => {

    return useQuery(['User'], fetchUser, {
        staleTime: 1000 * 60 * 3,
        cachetime: 1000 * 60 * 30,
        retry: 2,
    })
}

export default useUser;