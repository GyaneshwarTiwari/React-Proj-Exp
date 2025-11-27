import React, { useEffect, useRef, useState, useContext } from 'react';
import './profileMenu.css';
import { getNotifications, markNotificationAsRead, markAllNotificationsRead, deleteNotification, deleteAllNotifications } from '../../services/notificationService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../ui/LoadingSpinner';
import { getSocket, disconnectSocket } from '../../utils/socket';
import { AuthContext } from '../../contexts/AuthContext';

const NotificationMenu = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const auth = useContext(AuthContext);
    const wrapperRef = useRef(null);

    useEffect(() => {
        let s = null;
        let attached = false;

        const start = async () => {
            await loadNotifications();

            const token = auth?.token || localStorage.getItem('token');
            if (!token) return;

            s = getSocket(token);
            if (!s) return;

            // attach listeners once
            const onNotif = (notif) => {
                console.debug('[socket] received notification', notif);
                setNotifications((prev) => [notif, ...prev]);
                setUnreadCount((c) => (typeof c === 'number' ? c + 1 : 1));
                toast.info(notif.title || 'New notification');
            };

            const onConnectError = (err) => console.warn('Socket connect_error', err?.message || err);
            const onConnect = () => console.debug('[socket] connected');
            const onDisconnect = (reason) => console.debug('[socket] disconnected', reason);

            s.on('connect', onConnect);
            s.on('disconnect', onDisconnect);
            s.on('connect_error', onConnectError);
            s.on('notification', onNotif);
            attached = true;
        };

        start();

        return () => {
            try {
                if (s && attached) {
                    s.off('notification');
                    s.off('connect_error');
                    s.off('connect');
                    s.off('disconnect');
                }
            } catch (err) {
                console.warn('Error detaching socket listeners', err);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth?.token]);

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
        setLoading(true);
        try {
            const res = await getNotifications({ limit: 50 });
            setNotifications(res.notifications || []);
            setUnreadCount(res.unreadCount || 0);
        } catch (err) {
            console.error('Failed to load notifications', err);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
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
                        {loading && <LoadingSpinner />}
                        {!loading && notifications.length === 0 && <div className="p-3 small text-muted">No notifications</div>}
                        {!loading && notifications.map((n) => (
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
