import apiClient from "./apiClient";

export const getProjectMilestones = async ({ id }) => {
    var userType = "milestones";
    const url = `${userType}?project=${id}`;
    const { data } = await apiClient.get(url);
    return data;
}

export const getMilestoneDeliverables = async ({ id }) => {
    var userType = "deliverables";
    const url = `${userType}?milestone=${id}`;
    const { data } = await apiClient.get(url);
    return data;
}

// ----------------------------------------------------------------------

export const addSkill = async ({ id, body }) => {
    var userType = "skills";
    const url = `${userType}/`;
    const { data } = await apiClient.post(url, body);
    return data;
}