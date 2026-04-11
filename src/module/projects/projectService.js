import API from "../../services/api";

export const getProjects = () => API.get("/project/view/all");
export const addProject = (data) => API.post("/project/create", data);

export const viewProject = (id) => {
    return API.get("/project/view", {
        params: { projectId: id }
    });
};

export const assignMember = (data) => API.post("/project/assign/manager", data);
export const addMember = (data) => API.post("/project/add/member", data);
export const removeManger = (data) => API.delete("/project/remove/manager", data);
export const removeMember = (data) => API.delete("/project/remove/member", data);
/*
{
    "projectId": 1,
    "userId": 3
}
*/

export const deleteProject = (id) => {
    return API.delete(`/project/delete/${id}`);
};