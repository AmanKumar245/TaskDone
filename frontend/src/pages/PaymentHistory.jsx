import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const PaymentHistory = () => {
    const [activeTab, setActiveTab] = useState('earned');
    const [filter, setFilter] = useState('All');
    const [showFilter, setShowFilter] = useState(false);

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <DashboardLayout>
            <div>
                {/* Heading */}
                <h1 style={{
                    fontSize: '32px', fontWeight: '800', color: '#001D4A',
                    margin: '0 0 28px 0', fontFamily: 'Georgia, "Times New Roman", serif',
                }}>Payments History</h1>

                <div style={{
                    background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
                    padding: '28px',
                }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '0', marginBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
                        <button
                            onClick={() => setActiveTab('earned')}
                            style={{
                                padding: '12px 20px', border: 'none', background: 'none',
                                fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                                color: activeTab === 'earned' ? '#001D4A' : '#9ca3af',
                                borderBottom: activeTab === 'earned' ? '2px solid #001D4A' : '2px solid transparent',
                                marginBottom: '-2px', transition: 'all 0.2s ease',
                            }}
                        >Earned</button>
                        <button
                            onClick={() => setActiveTab('outgoing')}
                            style={{
                                padding: '12px 20px', border: 'none', background: 'none',
                                fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                                color: activeTab === 'outgoing' ? '#001D4A' : '#9ca3af',
                                borderBottom: activeTab === 'outgoing' ? '2px solid #001D4A' : '2px solid transparent',
                                marginBottom: '-2px', transition: 'all 0.2s ease',
                            }}
                        >Outgoing</button>
                    </div>

                    {/* Filter Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: '700', color: '#001D4A', margin: '0 0 8px 0' }}>Showing</p>
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowFilter(!showFilter)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: '8px',
                                        background: '#fff', fontSize: '14px', color: '#001D4A',
                                        cursor: 'pointer', fontWeight: '500', minWidth: '100px',
                                    }}
                                >
                                    {filter}
                                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {showFilter && (
                                    <div style={{
                                        position: 'absolute', top: '100%', left: 0, marginTop: '4px',
                                        background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 10,
                                        minWidth: '120px', overflow: 'hidden',
                                    }}>
                                        {['All', 'Last 7 days', 'Last 30 days', 'Last 90 days'].map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => { setFilter(opt); setShowFilter(false); }}
                                                style={{
                                                    display: 'block', width: '100%', padding: '10px 16px',
                                                    border: 'none', background: filter === opt ? '#f0f4ff' : '#fff',
                                                    fontSize: '13px', color: '#001D4A', cursor: 'pointer',
                                                    textAlign: 'left', fontWeight: filter === opt ? '600' : '400',
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = filter === opt ? '#f0f4ff' : '#fff'}
                                            >{opt}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p style={{ fontSize: '13px', color: '#9ca3af', margin: '10px 0 0 0' }}>
                                0 transactions for 1st Jan 2012 – {formattedDate}
                            </p>
                        </div>

                        {/* Net earned */}
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '14px', fontWeight: '700', color: '#001D4A', margin: '0 0 4px 0' }}>
                                {activeTab === 'earned' ? 'Net earned' : 'Net spent'}
                            </p>
                            <p style={{ fontSize: '24px', fontWeight: '800', color: '#001D4A', margin: 0 }}>₹0.00</p>
                        </div>
                    </div>

                    {/* Empty State */}
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', padding: '60px 20px', textAlign: 'center',
                    }}>
                        {/* Illustration */}
                        <div style={{ marginBottom: '24px', position: 'relative' }}>
                            <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
                                {/* Folder back */}
                                <rect x="15" y="25" width="70" height="55" rx="4" fill="#3b82f6" />
                                <path d="M15 29a4 4 0 014-4h18l6 8h27a4 4 0 014 4v43a4 4 0 01-4 4H19a4 4 0 01-4-4V29z" fill="#2563eb" />
                                {/* Folder front */}
                                <rect x="20" y="35" width="65" height="45" rx="3" fill="#60a5fa" />
                                {/* Paper sheet 1 */}
                                <rect x="30" y="18" width="40" height="50" rx="2" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
                                <line x1="36" y1="28" x2="64" y2="28" stroke="#e5e7eb" strokeWidth="2" />
                                <line x1="36" y1="35" x2="58" y2="35" stroke="#e5e7eb" strokeWidth="2" />
                                <line x1="36" y1="42" x2="62" y2="42" stroke="#e5e7eb" strokeWidth="2" />
                                {/* Magnifying glass */}
                                <circle cx="90" cy="35" r="14" stroke="#001D4A" strokeWidth="3" fill="none" />
                                <line x1="100" y1="45" x2="110" y2="55" stroke="#001D4A" strokeWidth="3" strokeLinecap="round" />
                                {/* Sparkles */}
                                <circle cx="105" cy="20" r="2" fill="#3b82f6" opacity="0.6" />
                                <circle cx="112" cy="28" r="1.5" fill="#3b82f6" opacity="0.4" />
                                <path d="M98 15l2 4 2-4-2-4z" fill="#3b82f6" opacity="0.5" />
                            </svg>
                        </div>
                        <p style={{
                            fontSize: '15px', color: '#6b7280', margin: '0 0 12px 0',
                            maxWidth: '360px', lineHeight: '1.5',
                        }}>
                            {activeTab === 'earned'
                                ? "You haven't earned from any tasks yet. Yet to find the right task?"
                                : "You haven't made any payments yet. Post a task to get started."
                            }
                        </p>
                        <Link
                            to="/tasks"
                            style={{
                                color: '#0047fb', fontWeight: '600', fontSize: '14px',
                                textDecoration: 'none',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >Browse tasks</Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PaymentHistory;
