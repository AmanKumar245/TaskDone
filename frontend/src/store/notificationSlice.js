import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axios';

// Thunks
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get('/notifications');
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch notifications');
        }
    }
);

export const fetchUnreadCount = createAsyncThunk(
    'notifications/fetchUnreadCount',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get('/notifications/unread-count');
            return data.count;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch count');
        }
    }
);

export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId, { rejectWithValue }) => {
        try {
            await axiosInstance.patch(`/notifications/${notificationId}/read`);
            return notificationId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to mark as read');
        }
    }
);

export const markAllAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.patch('/notifications/read-all');
            return true;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to mark all as read');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        unreadCount: 0,
        isLoading: false,
        error: null,
    },
    reducers: {
        addNotification: (state, action) => {
            state.items.unshift(action.payload);
            state.unreadCount += 1;
        },
        incrementUnread: (state) => {
            state.unreadCount += 1;
        },
        resetNotifications: (state) => {
            state.items = [];
            state.unreadCount = 0;
            state.isLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchNotifications
            .addCase(fetchNotifications.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // fetchUnreadCount
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            })
            // markAsRead
            .addCase(markAsRead.fulfilled, (state, action) => {
                const id = action.payload;
                const notif = state.items.find(n => n._id === id);
                if (notif && !notif.read) {
                    notif.read = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            // markAllAsRead
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.items.forEach(n => { n.read = true; });
                state.unreadCount = 0;
            });
    },
});

export const { addNotification, incrementUnread, resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
