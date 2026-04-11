import API from "../../services/api";

export const getProfile = (id) =>
    API.get("/user/view/profile", {
        params: {userId: id}
    });