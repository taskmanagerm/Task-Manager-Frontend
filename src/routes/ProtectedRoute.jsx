import { getStoredAuth } from "../utils/auth";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const auth = getStoredAuth();

    if (!auth) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;