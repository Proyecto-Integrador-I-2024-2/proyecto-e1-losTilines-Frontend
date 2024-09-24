import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const fetchAreaCompany = async()=>{

    const {data} = await apiClient.get("/company/areas/");
    
}