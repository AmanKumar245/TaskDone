import { createSlice } from '@reduxjs/toolkit';

const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
const token = localStorage.getItem('token') || null;

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userInfo,
        token,
    },
    reducers: {
        setCredentials: (state, action) => {
            const { userInfo, token } = action.payload;
            state.userInfo = userInfo;
            state.token = token;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            localStorage.setItem('token', token);
        },
        logout: (state) => {
            state.userInfo = null;
            state.token = null;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
        },
        updateUserInfo: (state, action) => {
            state.userInfo = { ...state.userInfo, ...action.payload };
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
        },
    },
});

export const { setCredentials, logout, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;
