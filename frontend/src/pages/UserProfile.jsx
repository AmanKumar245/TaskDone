import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axiosInstance.get(`/users/${userId}`);
                setProfile(data);
            } catch (err) {
                setError(err.response?.data?.message || 'User not found');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [userId]);

    const getOnlineStatus = (lastOnline) => {
        if (!lastOnline) return 'Offline';
        const diff = Date.now() - new Date(lastOnline).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 5) return 'Online now';
        if (mins < 60) return `Online ${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `Online ${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `Online ${days}d ago`;
        const months = Math.floor(days / 30);
        return `Online ${months} month${months > 1 ? 's' : ''} ago`;
    };

    const renderStars = (rating, size = 16) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} style={{ color: i <= Math.round(rating) ? '#f59e0b' : '#d1d5db', fontSize: `${size}px` }}>★</span>
            );
        }
        return stars;
    };

    const timeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const days = Math.floor(diff / 86400000);
        if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
        const weeks = Math.floor(days / 7);
        if (weeks < 5) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
        const months = Math.floor(days / 30);
        return `${months} month${months !== 1 ? 's' : ''} ago`;
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
                <span className="w-12 h-12 border-4 border-[#0047fb] border-t-transparent rounded-full animate-spin"></span>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', color: '#ef4444' }}>
                <p>{error || 'User not found'}</p>
            </div>
        );
    }

    const isNewUser = profile.reviewCount === 0;
    const hasPortfolio = profile.portfolio && profile.portfolio.length > 0;
    const hasReviews = profile.reviewCount > 0;

    return (
        <div style={{ background: '#f5f6fa', minHeight: 'calc(100vh - 64px)' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
                {/* Back button */}
                <button onClick={() => navigate(-1)} style={{
                    display: 'flex', alignItems: 'center', gap: '6px', color: '#001D4A',
                    fontWeight: '600', fontSize: '14px', marginBottom: '24px', background: 'none',
                    border: 'none', cursor: 'pointer',
                }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back
                </button>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {/* Left Sidebar Card */}
                    <div style={{
                        width: '320px', flexShrink: 0, background: '#fff',
                        borderRadius: '16px', border: '1px solid #e5e7eb', padding: '28px', 
                    }}>
                        <p style={{ fontSize: '11px', fontWeight: '800', color: '#0047fb', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>Meet</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div>
                                <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#001D4A', margin: '0 0 4px 0', lineHeight: '1.2' }}>
                                    {profile.firstName} {profile.lastName?.charAt(0)}.
                                    {profile.isVerified && <span style={{ color: '#0047fb', marginLeft: '6px', fontSize: '18px' }}>✓</span>}
                                </h1>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#22c55e', fontWeight: '600', margin: '0' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                                    {getOnlineStatus(profile.lastOnline)}
                                </p>
                            </div>
                            {profile.avatar ? (
                                <img src={profile.avatar} alt="" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }} />
                            ) : (
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontWeight: '700', fontSize: '24px',
                                }}>{profile.firstName?.charAt(0)}</div>
                            )}
                        </div>

                        {profile.location && (
                            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7280', margin: '0 0 16px 0' }}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {profile.location}
                            </p>
                        )}

                        {isNewUser && (
                            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ color: '#f59e0b' }}>☆</span>
                                {profile.firstName} has recently joined TaskDone and is ready to help you
                            </p>
                        )}

                        {/* Stats */}
                        {hasReviews && (
                            <div style={{ display: 'flex', gap: '24px', padding: '16px 0', borderTop: '1px solid #f3f4f6', marginTop: '8px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#001D4A' }}>{profile.rating}</span>
                                        <span style={{ color: '#f59e0b', fontSize: '18px' }}>★</span>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', margin: '2px 0 0 0' }}>Overall rating</p>
                                    <p style={{ fontSize: '12px', color: '#0047fb', fontWeight: '600', margin: '2px 0 0 0' }}>{profile.reviewCount} reviews</p>
                                </div>
                                <div>
                                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#001D4A' }}>{profile.completionRate}%</span>
                                    <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', margin: '2px 0 0 0' }}>Completion rate</p>
                                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>{profile.tasksCompleted} tasks</p>
                                </div>
                            </div>
                        )}

                        {/* Verified */}
                        <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '16px', paddingTop: '16px' }}>
                            <p style={{ fontSize: '14px', fontWeight: '700', color: '#001D4A', marginBottom: '12px' }}>Verified information</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#001D4A' }}>
                                <span style={{ color: '#0047fb', fontSize: '16px' }}>◉</span>
                                {profile.isVerified ? 'ID Verified' : 'Not yet verified'}
                                <svg width="14" height="14" fill="none" stroke="#9ca3af" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {isNewUser ? (
                            /* New User View */
                            <>
                                <div style={{
                                    background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
                                    padding: '28px', marginBottom: '20px',
                                }}>
                                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#001D4A', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        No reviews yet <span style={{ color: '#f59e0b' }}>★</span>
                                    </h2>
                                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                                        {profile.firstName} has recently joined TaskDone
                                    </p>
                                </div>

                                <div style={{
                                    background: '#f0f4ff', borderRadius: '16px', border: '1px solid #dbe4ff',
                                    padding: '28px',
                                }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#001D4A', margin: '0 0 20px 0' }}>
                                        Not sure about something? Ask {profile.firstName}.
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                        {['How long do you expect the task will take?', 'Can you show photos of your previous jobs?', 'Does the offer include materials?'].map((q, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                                                <span style={{ color: '#6b7280', fontSize: '16px' }}>
                                                    {i === 0 ? '⏱' : i === 1 ? '📸' : '📦'}
                                                </span>
                                                {q}
                                            </div>
                                        ))}
                                    </div>
                                    <button style={{
                                        marginTop: '20px', padding: '10px 24px', borderRadius: '24px',
                                        border: '2px solid #0047fb', background: 'transparent', color: '#0047fb',
                                        fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                                    }}>Reply to offer</button>
                                </div>
                            </>
                        ) : (
                            /* Experienced User View */
                            <>
                                {/* Portfolio */}
                                {hasPortfolio && (
                                    <div style={{
                                        background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
                                        padding: '28px', marginBottom: '20px',
                                    }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#001D4A', margin: '0 0 16px 0' }}>Portfolio</h2>
                                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                                            {profile.portfolio.map((img, i) => (
                                                <img key={i} src={img} alt={`Portfolio ${i + 1}`} style={{
                                                    width: '120px', height: '100px', borderRadius: '10px',
                                                    objectFit: 'cover', flexShrink: 0, cursor: 'pointer',
                                                }} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* About */}
                                {profile.about && (
                                    <div style={{
                                        background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
                                        padding: '28px', marginBottom: '20px',
                                    }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#001D4A', margin: '0 0 12px 0' }}>About</h2>
                                        <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
                                            {profile.about}
                                        </p>
                                    </div>
                                )}

                                {/* Reviews */}
                                {hasReviews && (
                                    <div style={{
                                        background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
                                        padding: '28px', marginBottom: '20px',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#001D4A', margin: 0 }}>
                                                Overall rating {profile.rating}
                                            </h2>
                                            <span style={{ color: '#f59e0b', fontSize: '18px' }}>★</span>
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px 0' }}>{profile.reviewCount} reviews</p>

                                        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px' }}>
                                            {profile.reviews.slice(0, 5).map(review => (
                                                <div key={review._id} style={{
                                                    minWidth: '220px', maxWidth: '240px', flexShrink: 0,
                                                    border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px',
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                        {review.reviewer?.avatar ? (
                                                            <img src={review.reviewer.avatar} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <div style={{
                                                                width: '28px', height: '28px', borderRadius: '50%',
                                                                background: '#e5e7eb', display: 'flex', alignItems: 'center',
                                                                justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#6b7280',
                                                            }}>{review.reviewer?.firstName?.charAt(0)}</div>
                                                        )}
                                                        <div>
                                                            <p style={{ fontSize: '13px', fontWeight: '700', color: '#001D4A', margin: 0 }}>
                                                                {review.reviewer?.firstName} {review.reviewer?.lastName?.charAt(0)}.
                                                            </p>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                {renderStars(review.rating, 12)}
                                                                <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: '4px' }}>{timeAgo(review.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p style={{
                                                        fontSize: '13px', color: '#374151', margin: '0 0 8px 0',
                                                        border: '1px solid #f3f4f6', borderRadius: '8px', padding: '10px',
                                                        background: '#f9fafb', lineHeight: '1.4',
                                                        overflow: 'hidden', textOverflow: 'ellipsis',
                                                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                                                    }}>
                                                        {review.comment || 'No comment'}
                                                    </p>
                                                    {review.taskTitle && (
                                                        <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>{review.taskTitle}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {profile.reviewCount > 5 && (
                                            <button style={{
                                                marginTop: '12px', padding: '8px 20px', borderRadius: '24px',
                                                border: '2px solid #0047fb', background: 'transparent', color: '#0047fb',
                                                fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                                            }}>See all {profile.reviewCount} reviews</button>
                                        )}
                                    </div>
                                )}

                                {/* Education */}
                                {profile.education && profile.education.length > 0 && (
                                    <div style={{
                                        background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
                                        padding: '28px', marginBottom: '20px',
                                    }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#001D4A', margin: '0 0 16px 0' }}>Education</h2>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {profile.education.map((edu, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#374151' }}>
                                                    <div style={{
                                                        width: '36px', height: '36px', borderRadius: '8px', background: '#f3f4f6',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <svg width="18" height="18" fill="none" stroke="#6b7280" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                                                    </div>
                                                    {edu}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Work Experience */}
                                {profile.workExperience && profile.workExperience.length > 0 && (
                                    <div style={{
                                        background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
                                        padding: '28px', marginBottom: '20px',
                                    }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#001D4A', margin: '0 0 16px 0' }}>Work experience</h2>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {profile.workExperience.map((exp, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#374151' }}>
                                                    <div style={{
                                                        width: '36px', height: '36px', borderRadius: '8px', background: '#f3f4f6',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <svg width="18" height="18" fill="none" stroke="#6b7280" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                    </div>
                                                    {exp}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
