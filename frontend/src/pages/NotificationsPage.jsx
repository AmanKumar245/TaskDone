import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useSocket } from '../context/SocketContext';
import { fetchNotifications, markAsRead, markAllAsRead, addNotification } from '../store/notificationSlice';
import DashboardLayout from '../components/DashboardLayout';

const NotificationsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const socket = useSocket();

    const { items: notifications, isLoading, unreadCount } = useSelector((state) => state.notifications);

    // Fetch notifications via Redux thunk
    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    // Listen for real-time notifications
    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (notification) => {
            dispatch(addNotification(notification));
        };

        socket.on('new_notification', handleNewNotification);
        return () => socket.off('new_notification', handleNewNotification);
    }, [socket, dispatch]);

    // Mark all as read
    const handleMarkAllRead = () => {
        dispatch(markAllAsRead());
    };

    // Mark single as read + navigate
    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            dispatch(markAsRead(notification._id));
        }

        // Navigate to relevant page
        if (notification.task?._id) {
            if (['new_offer', 'new_question', 'task_completed'].includes(notification.type)) {
                navigate(`/my-tasks/${notification.task._id}`);
            } else {
                navigate(`/tasks/${notification.task._id}`);
            }
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'new_offer':
                return (
                    <div style={{ ...iconStyle, background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <svg width="18" height="18" fill="#fff" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'offer_accepted':
                return (
                    <div style={{ ...iconStyle, background: 'linear-gradient(135deg, #0047fb, #0035c1)' }}>
                        <svg width="18" height="18" fill="#fff" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'new_question':
                return (
                    <div style={{ ...iconStyle, background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                        <svg width="18" height="18" fill="#fff" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'new_reply':
                return (
                    <div style={{ ...iconStyle, background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                        <svg width="18" height="18" fill="#fff" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'task_completed':
            case 'new_review':
                return (
                    <div style={{ ...iconStyle, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <svg width="18" height="18" fill="#fff" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                );
            case 'payment_released':
                return (
                    <div style={{ ...iconStyle, background: 'linear-gradient(135deg, #10b981, #047857)' }}>
                        <svg width="18" height="18" fill="#fff" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div style={{ ...iconStyle, background: 'linear-gradient(135deg, #6b7280, #4b5563)' }}>
                        <svg width="18" height="18" fill="#fff" viewBox="0 0 20 20">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                    </div>
                );
        }
    };

    const timeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(date).toLocaleDateString();
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                    <span className="w-12 h-12 border-4 border-[#0047fb] border-t-transparent rounded-full animate-spin"></span>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div>
                {/* Header */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '24px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h1 style={{
                            fontSize: '32px', fontWeight: '800', color: '#001D4A',
                            margin: 0, fontFamily: 'Georgia, "Times New Roman", serif',
                        }}>Notifications</h1>
                        {unreadCount > 0 && (
                            <span style={{
                                background: '#0047fb', color: '#fff', fontSize: '12px',
                                fontWeight: '700', padding: '2px 10px', borderRadius: '12px',
                            }}>{unreadCount}</span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            style={{
                                padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb',
                                background: '#fff', color: '#0047fb', fontWeight: '600',
                                fontSize: '13px', cursor: 'pointer',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                        >Mark all as read</button>
                    )}
                </div>

                {/* Notifications List */}
                <div style={{
                    background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                }}>
                    {notifications.length === 0 ? (
                        <div style={{
                            padding: '60px 24px', textAlign: 'center',
                        }}>
                            <svg width="64" height="64" fill="none" stroke="#d1d5db" viewBox="0 0 24 24" style={{ margin: '0 auto 16px' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <p style={{ fontSize: '16px', fontWeight: '700', color: '#374151', margin: '0 0 4px 0' }}>
                                No notifications yet
                            </p>
                            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
                                You'll see notifications here when someone interacts with your tasks
                            </p>
                        </div>
                    ) : (
                        notifications.map((notification, index) => (
                            <div
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification)}
                                style={{
                                    display: 'flex', alignItems: 'flex-start', gap: '14px',
                                    padding: '16px 24px', cursor: 'pointer',
                                    background: notification.read ? '#fff' : '#f0f4ff',
                                    borderBottom: index < notifications.length - 1 ? '1px solid #f3f4f6' : 'none',
                                    transition: 'background 0.15s ease',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = notification.read ? '#f9fafb' : '#e8edff';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = notification.read ? '#fff' : '#f0f4ff';
                                }}
                            >
                                {/* Icon */}
                                {getNotificationIcon(notification.type)}

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                        {/* Avatar */}
                                        {notification.sender?.avatar ? (
                                            <img src={notification.sender.avatar} alt="" style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                objectFit: 'cover', flexShrink: 0,
                                            }} />
                                        ) : (
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#fff', fontWeight: '700', fontSize: '13px', flexShrink: 0,
                                            }}>{notification.sender?.firstName?.charAt(0)}</div>
                                        )}

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{
                                                fontSize: '14px', color: '#001D4A', margin: '0 0 4px 0',
                                                fontWeight: notification.read ? '400' : '600',
                                                lineHeight: '1.4',
                                            }}>
                                                {notification.message}
                                            </p>
                                            <p style={{
                                                fontSize: '12px', color: '#9ca3af', margin: 0,
                                                fontWeight: '500',
                                            }}>
                                                {timeAgo(notification.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Unread indicator */}
                                {!notification.read && (
                                    <div style={{
                                        width: '8px', height: '8px', borderRadius: '50%',
                                        background: '#0047fb', flexShrink: 0, marginTop: '8px',
                                    }}></div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

const iconStyle = {
    width: '36px', height: '36px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
};

export default NotificationsPage;
