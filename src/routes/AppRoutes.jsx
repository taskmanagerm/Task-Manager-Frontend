import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import MainLayout from "../layouts/MainLayout";
import ProjectPage from "../module/projects/ProjectPage";
import UserPage from "../module/users/UserPage";
import MyProfile from "../module/profile/MyProfile";
import ProtectedRoute from "../routes/ProtectedRoute";
import UserProfilePage from "../module/users/UserProfilePage.jsx";
import ProjectDetailsPage from "../module/projects/ProjectDetailsPage.jsx";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="projects" replace />} />

                <Route path="projects" element={<ProjectPage />} />
                <Route path="users" element={<UserPage />} />
                <Route path="users/:id" element={<UserProfilePage />} />
                <Route path="profile" element={<MyProfile />} />
                <Route path="projects/:id" element={<ProjectDetailsPage />} />
            </Route>

        </Routes>
    );
};

export default AppRoutes;