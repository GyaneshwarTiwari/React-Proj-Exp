import api from '../api/api';

export const getNotifications = async (params = {}) => {
    const res = await api.get('/notifications', { params });
    return res.data;
};

export const markNotificationAsRead = async (id) => {
    const res = await api.patch(`/notifications/read/${id}`);
    return res.data;
};

export const markAllNotificationsRead = async () => {
    const res = await api.patch(`/notifications/read-all`);
    return res.data;
};

export const deleteNotification = async (id) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
}

export const deleteAllNotifications = async () => {
    const res = await api.delete('/notifications');
    return res.data;
}

