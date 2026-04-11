import api from "../../services/api";

export const getTasksByProject = async (projectId) => {
    return await api.get(`/task/view/all/project`,{
        params: {
            projectId: projectId
        }
    });
};

export const createTask = async (taskData) => {
    return await api.post("/task/create", taskData);
};

export const getTaskActions = async (taskId) => {
    return await api.get(`/task/action/view/all/task`,{
        params: {
            taskId: taskId
        }
    });
};

export const createTaskAction = async (actionData) => {
    return await api.post("task/action/create", actionData);
};

export const approveTask = async (taskId) => {
    return await api.patch(`/tasks/${taskId}/approve`);
};

export const rejectTask = async (taskId) => {
    return await api.patch(`/tasks/${taskId}/reject`);
};

export const updateTask = async (taskId, taskData) => {
    return await api.put(`/tasks/${taskId}`, taskData);
};

export const deleteTask = async (taskId) => {
    return await api.delete(`/tasks/${taskId}`);
};