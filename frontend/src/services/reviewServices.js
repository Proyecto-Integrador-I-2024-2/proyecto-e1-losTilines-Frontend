import apiClient from "@/services/apiClient";

export const postFreelancerComment = async (body) => {
    var route = "comments";
    const url = `${route}/`;
    const { data } = await apiClient.post(url, body);
    return data;
}
export const postFreelancerResponse = async (id, body) => {
    var route = "comments";
    const url = `${route}/${id}/respond/`;
    const { data } = await apiClient.patch(url, body);
    return data;
}
