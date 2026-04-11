export const getStoredAuth = () => {
    try {
        const auth = localStorage.getItem("auth");
        if (!auth) return null;

        const parsed = JSON.parse(auth);

        // Optional: Check if token is expired
        if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
            localStorage.removeItem("auth");
            return null;
        }

        return parsed;
    } catch (error) {
        console.error("Error getting stored auth:", error);
        localStorage.removeItem("auth");
        return null;
    }
};