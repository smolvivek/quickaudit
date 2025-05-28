import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  lastNotification: null
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        read: false
      };
      state.notifications.unshift(notification);
      state.unreadCount += 1;
      state.lastNotification = notification;
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.lastNotification = null;
    }
  }
});

export const {
  setNotification,
  markAsRead,
  markAllAsRead,
  clearNotifications
} = notificationSlice.actions;

export default notificationSlice.reducer; 