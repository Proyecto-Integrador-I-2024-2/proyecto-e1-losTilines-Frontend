import apiClient from "@/services/apiClient";

export const getFreelancerInterest = async (id) => {
    var route = "projectsfreelancers";
    const url = `${route}?status=freelancer_interested&project=${id}`;
    const { data } = await apiClient.get(url);
    return data;
}
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

export const patchProjectFreelancerInterest = async (id, body) => {
    var route = "projectsfreelancers";
    const url = `${route}/${id}/`;
    const { data, status } = await apiClient.patch(url, body);
    return { data, status };
}

export const getCompanyInterest = async (id) => {
    var route = "projectsfreelancers";
    const url = `${route}?status=company_interested&freelancer=${id}`;
    const { data } = await apiClient.get(url);
    return data;
}

export const postCompanyInterest = async (body) => {
    var route = "projectsfreelancers";
    const url = `${route}/`;
    const { data } = await apiClient.post(url, body);
    return data;
}

