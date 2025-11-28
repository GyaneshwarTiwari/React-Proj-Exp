// src/components/layout/NotificationMenu.jsx
import React, { useEffect, useRef, useState, useContext } from 'react';
import '../../styles/menus.css'; // Updated CSS import
import { getNotifications, markNotificationAsRead, markAllNotificationsRead, deleteNotification, deleteAllNotifications } from '../../services/notificationService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../ui/LoadingSpinner';
import { getSocket } from '../../utils/socket';
import { AuthContext } from '../../contexts/AuthContext';

const NotificationMenu = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false); // Changed default to false to prevent spinner on first render before click
    const auth = useContext(AuthContext);
    const wrapperRef = useRef(null);
    const hasLoadedRef = useRef(false); // Track if we've fetched data

    // --- Socket Logic (Kept same) ---
    useEffect(() => {
        let s = null;
        let attached = false;

        // Only connect socket if we have a token
        const token = auth?.token || localStorage.getItem('token');
        if (!token) return;

        s = getSocket(token);
        if (!s) return;

        const onNotif = (notif) => {
            console.debug('[socket] received notification', notif);
            setNotifications((prev) => [notif, ...prev]);
            setUnreadCount((c) => (typeof c === 'number' ? c + 1 : 1));
            toast.info(notif.title || 'New notification');
        };

        s.on('notification', onNotif);
        attached = true;

        return () => {
            if (s && attached) s.off('notification');
        };
    }, [auth?.token]);

    // --- Click Outside ---
    useEffect(() => {
        function handleDown(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleDown);
        return () => document.removeEventListener('mousedown', handleDown);
    }, []);

    // Load notifications only when opened for the first time
    useEffect(() => {
        if (open && !hasLoadedRef.current) {
            loadNotifications();
        }
    }, [open]);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const res = await getNotifications({ limit: 50 });
            setNotifications(res.notifications || []);
            setUnreadCount(res.unreadCount || 0);
            hasLoadedRef.current = true;
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- Actions ---
    const handleMarkRead = async (id, e) => {
        e.stopPropagation();
        try {
            const res = await markNotificationAsRead(id);
            setNotifications((prev) => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(res.unreadCount ?? Math.max(0, unreadCount - 1));
        } catch (err) { toast.error('Action failed'); }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            const res = await deleteNotification(id);
            setNotifications((prev) => prev.filter(n => n._id !== id));
            setUnreadCount(res.unreadCount ?? Math.max(0, unreadCount - 1));
        } catch (err) { toast.error('Delete failed'); }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) { toast.error('Failed'); }
    };

    const handleClearAll = async () => {
        if (!window.confirm('Clear all history?')) return;
        try {
            await deleteAllNotifications();
            setNotifications([]);
            setUnreadCount(0);
        } catch (err) { toast.error('Failed'); }
    };

    // Helper for time format
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="position-relative" ref={wrapperRef}>
            <button
                className="menu-trigger-btn"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-label="Notifications"
            >
                <i className="bi bi-bell" style={{ fontSize: '1.25rem' }}></i>
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="dropdown-panel notification-panel">
                    {/* Header */}
                    <div className="panel-header">
                        <div>
                            <h4 className="panel-title">Notifications</h4>
                            <p className="panel-subtitle">You have {unreadCount} unread messages</p>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-link p-0 text-decoration-none small fw-semibold" onClick={handleMarkAllRead} style={{ fontSize: '0.8rem' }}>
                                Read All
                            </button>
                            <button className="btn btn-link p-0 text-decoration-none small text-muted hover-danger" onClick={handleClearAll} style={{ fontSize: '0.8rem' }}>
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="panel-list">
                        {loading && <div className="p-4"><LoadingSpinner /></div>}

                        {!loading && notifications.length === 0 && (
                            <div className="p-5 text-center text-muted">
                                <i className="bi bi-bell-slash mb-2 d-block" style={{ fontSize: '1.5rem', opacity: 0.5 }}></i>
                                <span className="small">No notifications yet</span>
                            </div>
                        )}

                        {!loading && notifications.map((n) => (
                            <div key={n._id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                                {/* Status Dot */}
                                <div className="notif-dot" title={n.read ? "Read" : "Unread"}></div>

                                {/* Content */}
                                <div className="notif-content">
                                    <div className="notif-title">{n.title}</div>
                                    <div className="notif-message">{n.message}</div>
                                    <div className="notif-time">{formatTime(n.createdAt)}</div>
                                </div>

                                {/* Hover Actions */}
                                <div className="notif-actions">
                                    {!n.read && (
                                        <button className="icon-btn-sm" title="Mark as read" onClick={(e) => handleMarkRead(n._id, e)}>
                                            <i className="bi bi-check2"></i>
                                        </button>
                                    )}
                                    <button className="icon-btn-sm danger" title="Delete" onClick={(e) => handleDelete(n._id, e)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
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