import apiClient from "./apiClient";

export const getProjectMilestones = async ({ id }) => {
    var userType = "milestones";
    const url = `${userType}?project=${id}`;
    const { data } = await apiClient.get(url);
    return data;
}