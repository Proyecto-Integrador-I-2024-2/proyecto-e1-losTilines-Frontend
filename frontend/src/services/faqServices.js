import apiClient from "./apiClient";

export const postQuestion = async ({ body }) => {
    console.log("body on post", body);
    var route = "support";
    const url = `${route}/`;
    const { data, status } = await apiClient.post(url, body);
    return { data, status };
}