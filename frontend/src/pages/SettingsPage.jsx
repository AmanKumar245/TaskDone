import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const SettingsPage = () => {
    const { section } = useParams();
    const activeSection = section || 'mobile';
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const renderContent = () => {
        switch (activeSection) {
            case 'mobile':
                return (
                    <div>
                        <h2 style={styles.sectionTitle}>Mobile Number</h2>
                        <p style={styles.sectionDesc}>Your mobile number is used to notify you about your tasks and for account security.</p>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Phone Number</label>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <input
                                    type="tel"
                                    defaultValue={userInfo?.phone || ''}
                                    placeholder="+91 XXXXX XXXXX"
                                    style={styles.input}
                                />
                                <button style={styles.primaryBtn}>Update</button>
                            </div>
                        </div>
                    </div>
                );

            case 'email':
                return (
                    <div>
                        <h2 style={styles.sectionTitle}>Email Address</h2>
                        <p style={styles.sectionDesc}>Your email is used for login, notifications, and account recovery.</p>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Email</label>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <input
                                    type="email"
                                    defaultValue={userInfo?.email || ''}
                                    placeholder="your@email.com"
                                    style={styles.input}
                                />
                                <button style={styles.primaryBtn}>Update</button>
                            </div>
                        </div>
                    </div>
                );

            case 'profile':
                return (
                    <div>
                        <h2 style={styles.sectionTitle}>Profile Information</h2>
                        <p style={styles.sectionDesc}>Update your public profile details.</p>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>First Name</label>
                            <input type="text" defaultValue={userInfo?.firstName || ''} style={styles.input} />
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Last Name</label>
                            <input type="text" defaultValue={userInfo?.lastName || ''} style={styles.input} />
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>About</label>
                            <textarea rows={4} placeholder="Tell others about yourself..." style={{ ...styles.input, resize: 'vertical', minHeight: '100px' }} />
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Location</label>
                            <input type="text" placeholder="e.g. Mumbai, Maharashtra" style={styles.input} />
                        </div>
                        <button style={styles.primaryBtn}>Save Changes</button>
                    </div>
                );

            case 'verify-account':
                return (
                    <div>
                        <h2 style={styles.sectionTitle}>Verify Account</h2>
                        <p style={styles.sectionDesc}>Verified accounts build trust and get more tasks.</p>
                        <div style={{
                            padding: '24px', background: '#f0f4ff', borderRadius: '12px',
                            border: '1px solid #dbe4ff', display: 'flex', alignItems: 'center', gap: '16px',
                        }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%',
                                background: '#0047fb', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <svg width="24" height="24" fill="#fff" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p style={{ fontSize: '16px', fontWeight: '700', color: '#001D4A', margin: '0 0 4px 0' }}>Identity Verification</p>
                                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Upload a government-issued ID to verify your identity</p>
                            </div>
                        </div>
                        <button style={{ ...styles.primaryBtn, marginTop: '20px' }}>Start Verification</button>
                    </div>
                );

            case 'change-password':
                return (
                    <div>
                        <h2 style={styles.sectionTitle}>Change Password</h2>
                        <p style={styles.sectionDesc}>Keep your account secure with a strong password.</p>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Current Password</label>
                            <input type="password" placeholder="Enter current password" style={styles.input} />
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>New Password</label>
                            <input type="password" placeholder="Enter new password" style={styles.input} />
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Confirm New Password</label>
                            <input type="password" placeholder="Confirm new password" style={styles.input} />
                        </div>
                        <button style={styles.primaryBtn}>Update Password</button>
                    </div>
                );

            case 'notification-settings':
                return (
                    <div>
                        <h2 style={styles.sectionTitle}>Notification Settings</h2>
                        <p style={styles.sectionDesc}>Choose how you want to be notified.</p>
                        {['Email notifications', 'SMS notifications', 'Push notifications', 'Marketing emails'].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '16px 0', borderBottom: '1px solid #f3f4f6',
                            }}>
                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#001D4A' }}>{item}</span>
                                <label style={{
                                    position: 'relative', width: '44px', height: '24px',
                                    display: 'inline-block', cursor: 'pointer',
                                }}>
                                    <input type="checkbox" defaultChecked={i < 3} style={{ opacity: 0, width: 0, height: 0 }} />
                                    <span style={{
                                        position: 'absolute', inset: 0, borderRadius: '12px',
                                        background: i < 3 ? '#0047fb' : '#d1d5db',
                                        transition: 'background 0.2s',
                                    }}>
                                        <span style={{
                                            position: 'absolute', left: i < 3 ? '22px' : '2px', top: '2px',
                                            width: '20px', height: '20px', borderRadius: '50%',
                                            background: '#fff', transition: 'left 0.2s',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                                        }}></span>
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                );

            case 'task-alerts':
                return (
                    <div>
                        <h2 style={styles.sectionTitle}>Task Alerts</h2>
                        <p style={styles.sectionDesc}>Get notified when new tasks matching your skills are posted.</p>
                        <div style={{
                            padding: '24px', background: '#f9fafb', borderRadius: '12px',
                            border: '1px solid #e5e7eb', textAlign: 'center',
                        }}>
                            <svg width="48" height="48" fill="none" stroke="#9ca3af" viewBox="0 0 24 24" style={{ marginBottom: '12px' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                                Add your skills to receive task alerts for matching tasks in your area.
                            </p>
                        </div>
                    </div>
                );

            case 'skills':
                return (
                    <div>
                        <h2 style={styles.sectionTitle}>Skills</h2>
                        <p style={styles.sectionDesc}>Add skills to help task posters find you.</p>
                        <div style={{
                            padding: '24px', background: '#f9fafb', borderRadius: '12px',
                            border: '1px solid #e5e7eb', textAlign: 'center',
                        }}>
                            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0' }}>
                                You haven't added any skills yet.
                            </p>
                            <button style={styles.outlineBtn}>Add Skills</button>
                        </div>
                    </div>
                );

            case 'badges':
                return (
                    <div>
                        <h2 style={styles.sectionTitle}>Badges</h2>
                        <p style={styles.sectionDesc}>Earn badges by completing tasks and receiving great reviews.</p>
                        <div style={{
                            padding: '24px', background: '#f9fafb', borderRadius: '12px',
                            border: '1px solid #e5e7eb', textAlign: 'center',
                        }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 16px auto',
                                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                opacity: 0.3,
                            }}>
                                <svg width="32" height="32" fill="#fff" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                                No badges earned yet. Complete tasks to earn badges!
                            </p>
                        </div>
                    </div>
                );

            case 'portfolio':
                return (
                    <div>
                        <h2 style={styles.sectionTitle}>Portfolio</h2>
                        <p style={styles.sectionDesc}>Showcase your work to help win more tasks.</p>
                        <div style={{
                            padding: '24px', background: '#f9fafb', borderRadius: '12px',
                            border: '2px dashed #d1d5db', textAlign: 'center', cursor: 'pointer',
                        }}>
                            <svg width="48" height="48" fill="none" stroke="#9ca3af" viewBox="0 0 24 24" style={{ marginBottom: '12px' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>
                                Drag and drop images here or click to upload
                            </p>
                            <button style={styles.outlineBtn}>Upload Photos</button>
                        </div>
                    </div>
                );

            default:
                return (
                    <div>
                        <h2 style={styles.sectionTitle}>Settings</h2>
                        <p style={styles.sectionDesc}>Select a setting from the sidebar to get started.</p>
                    </div>
                );
        }
    };

    return (
        <DashboardLayout>
            <div style={{
                background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
                padding: '32px',
            }}>
                {renderContent()}
            </div>
        </DashboardLayout>
    );
};

const styles = {
    sectionTitle: {
        fontSize: '24px', fontWeight: '700', color: '#001D4A',
        margin: '0 0 8px 0',
    },
    sectionDesc: {
        fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0', lineHeight: '1.5',
    },
    fieldGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block', fontSize: '13px', fontWeight: '600',
        color: '#374151', marginBottom: '6px',
    },
    input: {
        width: '100%', padding: '10px 14px', border: '1px solid #d1d5db',
        borderRadius: '8px', fontSize: '14px', color: '#001D4A',
        outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
        transition: 'border-color 0.2s',
    },
    primaryBtn: {
        padding: '10px 24px', borderRadius: '8px', border: 'none',
        background: '#0047fb', color: '#fff', fontWeight: '600',
        fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s',
    },
    outlineBtn: {
        padding: '10px 24px', borderRadius: '8px',
        border: '2px solid #0047fb', background: 'transparent',
        color: '#0047fb', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
    },
};

export default SettingsPage;
