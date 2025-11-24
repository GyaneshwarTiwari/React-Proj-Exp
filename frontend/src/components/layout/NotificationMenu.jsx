import React, { useEffect, useRef, useState } from 'react';
import './profileMenu.css';
import { getNotifications, markNotificationAsRead, markAllNotificationsRead, deleteNotification, deleteAllNotifications } from '../../services/notificationService';
import { toast } from 'react-toastify';

const NotificationMenu = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const wrapperRef = useRef(null);

    useEffect(() => {
        loadNotifications();
    }, []);

    useEffect(() => {
        function handleDown(e) {
            if (!wrapperRef.current) return;
            if (!wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleDown);
        document.addEventListener('touchstart', handleDown);
        return () => {
            document.removeEventListener('mousedown', handleDown);
            document.removeEventListener('touchstart', handleDown);
        };
    }, []);

    const loadNotifications = async () => {
        try {
            const res = await getNotifications({ limit: 50 });
            setNotifications(res.notifications || []);
            setUnreadCount(res.unreadCount || 0);
        } catch (err) {
            console.error('Failed to load notifications', err);
        }
    };

    const handleOpen = () => {
        setOpen((s) => !s);
    };

    const handleMarkRead = async (id) => {
        try {
            const res = await markNotificationAsRead(id);
            // update local list
            setNotifications((prev) => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(res.unreadCount ?? Math.max(0, unreadCount - 1));
        } catch (err) {
            console.error(err);
            toast.error('Failed to mark notification read');
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
            toast.error('Failed to mark all read');
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteNotification(id);
            setNotifications((prev) => prev.filter(n => n._id !== id));
            setUnreadCount(res.unreadCount ?? Math.max(0, unreadCount - 1));
            toast.success('Notification deleted');
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete notification');
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm('Delete ALL notifications? This cannot be undone.')) return;
        try {
            const res = await deleteAllNotifications();
            setNotifications([]);
            setUnreadCount(0);
            toast.success(`Deleted ${res.deletedCount || 0} notifications`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete all notifications');
        }
    };

    return (
        <div className="profile-menu-wrapper me-2" ref={wrapperRef}>
            <button className="profile-icon btn-reset position-relative" onClick={handleOpen} aria-label="Notifications">
                <i className="bi bi-bell" style={{ fontSize: '1.25rem' }}></i>
                {unreadCount > 0 && (
                    <span className="badge bg-danger position-absolute" style={{ top: -6, right: -6 }}>{unreadCount}</span>
                )}
            </button>

            {open && (
                <div className="profile-dropdown shadow-sm" style={{ minWidth: 320 }}>
                    <div className="profile-header">
                        <div className="profile-meta">
                            <div className="name">Notifications</div>
                            <div className="email small text-muted">Recent activity and alerts</div>
                        </div>
                        {notifications.length > 0 && (
                            <div className="profile-actions">
                                <button className="btn btn-sm btn-link me-2" onClick={handleMarkAllRead}>Mark all read</button>
                                <button className="btn btn-sm btn-link text-danger" onClick={handleClearAll}>Clear all</button>
                            </div>
                        )}
                    </div>
                    <div className="divider" />

                    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                        {notifications.length === 0 && <div className="p-3 small text-muted">No notifications</div>}
                        {notifications.map((n) => (
                            <div key={n._id} className="dropdown-item" style={{ background: n.read ? 'transparent' : 'rgba(99,102,241,0.06)' }}>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600 }}>{n.title}</div>
                                        <div className="small text-muted">{n.message}</div>
                                        <div className="small text-muted mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                                    </div>
                                    <div className="ms-2 d-flex flex-column align-items-end gap-2">
                                        <div>
                                            {!n.read && <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleMarkRead(n._id)}>Mark read</button>}
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(n._id)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationMenu;
