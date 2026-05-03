import React from 'react';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = ({ children }) => {
    return (
        <div style={{
            background: '#f5f6fa',
            minHeight: 'calc(100vh - 64px)',
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '32px 24px',
                display: 'flex',
                gap: '32px',
                alignItems: 'flex-start',
            }}>
                <DashboardSidebar />
                <div style={{ flex: 1, minWidth: 0 }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
