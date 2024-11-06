import apiClient from "@/services/apiClient";

// ----------------------- Freelancer Skills CRUD -----------------------

export const getFreelancer = async ({ id }) => {
    var route = "freelancer";
    const url = `${route}/${id}/`;
    const { data } = await apiClient.get(url);
    return data;
}

export const editFreelancerExperience = async ({ id, body }) => {
    var route = "experience";
    const url = `${route}/${id}/`;
    const { data } = await apiClient.patch(url, body);
    return data;
}

export const deleteFreelancerExperience = async ({ id }) => {
    var route = "experience";
    const url = `${route}/${id}/`;
    const { data } = await apiClient.delete(url);
    return data;
}

export const addFreelancerSkill = async ({ body }) => {
    const id = sessionStorage.getItem("id");
    var route = "freelancer-skills";
    const url = `${route}/`;
    body["freelancer"] = id;
    const { data } = await apiClient.post(url, body);
    return data;
}

export const editFreelancerSkill = async ({ id, body }) => {
    var route = "freelancer-skills";
    const url = `${route}/${id}/`;
    const { data } = await apiClient.patch(url, body);
    return data;
}

export const deleteFreelancerSkill = async ({ id }) => {
    var route = "freelancer-skills";
    const url = `${route}/${id}/`;
    const { data } = await apiClient.delete(url);
    return data;
}

// ----------------------- Worker Profile CRUD -----------------------

export const editWorkerProfile = async ({ body }) => {
    const id = sessionStorage.getItem("id");
    var userType = "workers";
    const url = `${userType}/${id}/`;
    const { data } = await apiClient.patch(url, body);
    return data;
}

// ----------------------- Company Profile CRUD -----------------------

export const getCompany = async ({ id }) => {
    var userType = "company";
    const url = `${userType}/${id}/`;
    const { data } = await apiClient.get(url);
    return data;
}