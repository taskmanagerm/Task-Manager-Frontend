import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    permissions: []
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const user = action.payload;

            if (!user) return;

            state.user = user;
            state.token = user.token || null;

            // Safe permission extraction
            state.permissions =
                user.roles?.flatMap(role =>
                    role.permissions?.map(p => p.name)
                ) || [];
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.permissions = [];
        }
    }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;