import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const TaskerDashboard = () => {
    return (
        <DashboardLayout>
            <div>
                {/* Heading */}
                <h1 style={{
                    fontSize: '32px', fontWeight: '800', color: '#001D4A',
                    margin: '0 0 32px 0', fontFamily: 'Georgia, "Times New Roman", serif',
                }}>My Tasker Dashboard</h1>

                {/* Current Tier */}
                <div style={{
                    background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
                    padding: '28px',
                }}>
                    {/* YOUR CURRENT TIER */}
                    <p style={{
                        fontSize: '11px', fontWeight: '800', color: '#6b7280',
                        textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 16px 0',
                    }}>YOUR CURRENT TIER</p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        {/* Bronze Medal Icon */}
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #cd7f32 0%, #e8a849 50%, #cd7f32 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(205, 127, 50, 0.3)',
                        }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #e8a849 0%, #cd7f32 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '2px solid rgba(255,255,255,0.4)',
                                fontSize: '16px', fontWeight: '800', color: '#fff',
                            }}>A</div>
                        </div>
                        <div>
                            <p style={{ fontSize: '18px', fontWeight: '700', color: '#001D4A', margin: '0 0 2px 0' }}>Bronze</p>
                            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>20% service fee</p>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f3f4f6', margin: '0 0 24px 0' }}></div>

                    {/* YOUR NEXT TIER */}
                    <p style={{
                        fontSize: '11px', fontWeight: '800', color: '#6b7280',
                        textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 16px 0',
                    }}>YOUR NEXT TIER</p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        {/* Silver Medal Icon */}
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #a8a8a8 0%, #d4d4d4 50%, #a8a8a8 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(168, 168, 168, 0.3)',
                        }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #d4d4d4 0%, #a8a8a8 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '2px solid rgba(255,255,255,0.4)',
                            }}>
                                <svg width="16" height="16" fill="#666" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <p style={{ fontSize: '18px', fontWeight: '700', color: '#001D4A', margin: '0 0 2px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                Silver
                                <svg width="14" height="14" fill="#9ca3af" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </p>
                            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>18.5% service fee</p>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f3f4f6', margin: '0 0 24px 0' }}></div>

                    {/* Earnings Section */}
                    <p style={{
                        fontSize: '16px', fontWeight: '700', color: '#001D4A', margin: '0 0 8px 0',
                    }}>Your Earnings (last 30 days)</p>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 20px 0' }}>
                        Your earnings are ₹500 away from <strong style={{ color: '#001D4A' }}>Silver</strong> and lowering service fees.
                    </p>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: '8px' }}>
                        <div style={{
                            display: 'inline-block', padding: '4px 12px', background: '#f3f4f6',
                            borderRadius: '6px', fontSize: '14px', fontWeight: '600', color: '#001D4A',
                        }}>₹0</div>
                    </div>
                    <div style={{
                        height: '8px', borderRadius: '4px', background: '#e5e7eb',
                        position: 'relative', marginBottom: '8px',
                    }}>
                        <div style={{
                            height: '100%', width: '0%', borderRadius: '4px',
                            background: 'linear-gradient(90deg, #0047fb, #3b82f6)',
                        }}></div>
                    </div>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: '12px', color: '#9ca3af', fontWeight: '500',
                    }}>
                        <span>₹0</span>
                        <span>₹500</span>
                        <span>₹1,500</span>
                        <span>₹2,500+</span>
                    </div>

                    {/* How do tiers work */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f3f4f6',
                    }}>
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            border: '2px solid #0047fb', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px', fontWeight: '700', color: '#0047fb',
                        }}>?</div>
                        <a href="#" style={{
                            color: '#0047fb', fontWeight: '600', fontSize: '14px',
                            textDecoration: 'none',
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >How do tiers work?</a>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TaskerDashboard;
