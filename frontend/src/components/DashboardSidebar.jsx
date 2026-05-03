import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const DashboardSidebar = () => {
    const location = useLocation();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [showSettings, setShowSettings] = useState(location.pathname.startsWith('/dashboard/settings'));

    const mainLinks = [
        { label: 'Home', path: '/discover' },
        { label: 'My Tasker Dashboard', path: '/dashboard' },
        { label: 'Payments history', path: '/dashboard/payment-history' },
        { label: 'Payment methods', path: '/dashboard/payment-methods' },
        { label: 'Notifications', path: '/dashboard/notifications' },
        { label: 'Profile', path: '/dashboard/profile' },
        { label: 'Skills', path: '/dashboard/skills' },
        { label: 'Badges', path: '/dashboard/badges' },
        { label: 'Portfolio', path: '/dashboard/portfolio' },
    ];

    const settingsLinks = [
        { label: 'Mobile', path: '/dashboard/settings/mobile' },
        { label: 'Email', path: '/dashboard/settings/email' },
        { label: 'Profile', path: '/dashboard/settings/profile' },
        { label: 'Verify Account', path: '/dashboard/settings/verify-account' },
        { label: 'Change password', path: '/dashboard/settings/change-password' },
        { label: 'Notification settings', path: '/dashboard/settings/notification-settings' },
        { label: 'Task alerts', path: '/dashboard/settings/task-alerts' },
        { label: 'Skills', path: '/dashboard/settings/skills' },
        { label: 'Badges', path: '/dashboard/settings/badges' },
        { label: 'Portfolio', path: '/dashboard/settings/portfolio' },
    ];

    const isActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true;
        if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const isSettingsActive = location.pathname.startsWith('/dashboard/settings');

    return (
        <div style={{
            width: '280px',
            flexShrink: 0,
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            padding: '28px 0',
            alignSelf: 'flex-start',
            position: 'sticky',
            top: '88px',
        }}>
            {/* Avatar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', padding: '0 24px' }}>
                <div style={{
                    width: '96px', height: '96px', borderRadius: '50%',
                    background: '#e8eeff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', marginBottom: '14px', border: '3px solid #f0f3ff',
                }}>
                    {userInfo?.avatar ? (
                        <img src={userInfo.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <svg width="52" height="52" fill="#b0c4ff" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
                <p style={{
                    fontSize: '16px', fontWeight: '700', color: '#001D4A', margin: 0, textAlign: 'center',
                }}>{userInfo?.firstName} {userInfo?.lastName}</p>
            </div>

            {/* Navigation */}
            <nav>
                {showSettings ? (
                    /* Settings Sub-menu */
                    <>
                        <button
                            onClick={() => setShowSettings(false)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                width: '100%', padding: '12px 24px', border: 'none', background: 'none',
                                fontSize: '15px', fontWeight: '700', color: '#001D4A', cursor: 'pointer',
                                textAlign: 'left', marginBottom: '4px',
                            }}
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Settings
                        </button>
                        {settingsLinks.map((link) => {
                            const active = isActive(link.path);
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    style={{
                                        display: 'block',
                                        padding: '11px 24px',
                                        fontSize: '14px',
                                        fontWeight: active ? '700' : '500',
                                        color: active ? '#0047fb' : '#001D4A',
                                        textDecoration: 'none',
                                        borderLeft: active ? '3px solid #0047fb' : '3px solid transparent',
                                        background: active ? '#f0f4ff' : 'transparent',
                                        transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!active) {
                                            e.currentTarget.style.background = '#f9fafb';
                                            e.currentTarget.style.color = '#0047fb';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!active) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#001D4A';
                                        }
                                    }}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </>
                ) : (
                    /* Main Menu */
                    <>
                        {mainLinks.map((link) => {
                            const active = isActive(link.path);
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    style={{
                                        display: 'block',
                                        padding: '11px 24px',
                                        fontSize: '14px',
                                        fontWeight: active ? '700' : '500',
                                        color: active ? '#0047fb' : '#001D4A',
                                        textDecoration: 'none',
                                        borderLeft: active ? '3px solid #0047fb' : '3px solid transparent',
                                        background: active ? '#f0f4ff' : 'transparent',
                                        transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!active) {
                                            e.currentTarget.style.background = '#f9fafb';
                                            e.currentTarget.style.color = '#0047fb';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!active) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#001D4A';
                                        }
                                    }}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}

                        {/* Settings with chevron */}
                        <button
                            onClick={() => setShowSettings(true)}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                width: '100%', padding: '11px 24px', border: 'none', background: 'none',
                                fontSize: '14px', fontWeight: isSettingsActive ? '700' : '500',
                                color: isSettingsActive ? '#0047fb' : '#001D4A',
                                cursor: 'pointer', textAlign: 'left',
                                borderLeft: isSettingsActive ? '3px solid #0047fb' : '3px solid transparent',
                                transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                                if (!isSettingsActive) {
                                    e.currentTarget.style.background = '#f9fafb';
                                    e.currentTarget.style.color = '#0047fb';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isSettingsActive) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#001D4A';
                                }
                            }}
                        >
                            Settings
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </nav>
        </div>
    );
};

export default DashboardSidebar;
