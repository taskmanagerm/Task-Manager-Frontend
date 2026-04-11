import { useSelector } from "react-redux";

const useAccess = () => {

    const reduxAuth = useSelector((state) => state.auth);

    const storedAuth = JSON.parse(localStorage.getItem("auth"));

    const permissions =
        reduxAuth?.permissions?.length > 0
            ? reduxAuth.permissions
            : storedAuth?.permissions || [];

    const can = (permission) => {
        return permissions.includes(permission);
    };

    return { can };
};

export default useAccess;