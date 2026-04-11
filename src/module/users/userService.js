import API from "../../services/api";

export const getUsers = () => API.get("/user/view/all");
export const createUser = (data) => API.post("/user/signup", data);
export const updateUser = (id, data) => API.put("/user/update", data);
export const deleteUser = (id) =>
    API.delete("/user/delete", {
        params: { userId: id }
    });
export const getUsersByRole = (name) =>
    API.get("/user/view/all/role", {
        params: { roleName: name }
    });
export const getUserById = (id) => API.get("/user/view", id);