import apiClient from "@/services/apiClient";

export const postFreelancerInterest = async (body) => {
    var route = "projectsfreelancers";
    const id = sessionStorage.getItem("id");
    console.log("ID", id);
    console.log("Body", body);
    body["freelancer"] = id;
    console.log("Body", body);
    const url = `${route}/`;
    const { data } = await apiClient.post(url, body);
    return data;
}
export const postCompanyInterest = async (body) => {
    var route = "projectsfreelancers";
    const url = `${route}/`;
    const { data } = await apiClient.post(url, body);
    return data;
}
