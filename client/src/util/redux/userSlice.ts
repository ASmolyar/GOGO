import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    admin: boolean;
}

const initialState: UserState = {
    email: null,
    firstName: null,
    lastName: null,
    admin: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (
            state,
            action: PayloadAction<{
                email: string;
                firstName?: string;
                lastName?: string;
                admin: boolean;
            }>,
        ) => {
            state.email = action.payload.email;
            state.firstName = action.payload.firstName || null;
            state.lastName = action.payload.lastName || null;
            state.admin = action.payload.admin;
        },
        logout: (state) => {
            state.email = null;
            state.firstName = null;
            state.lastName = null;
            state.admin = false;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;

