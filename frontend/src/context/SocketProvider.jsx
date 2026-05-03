import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import SocketContext from './SocketContext';

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const newSocket = io(import.meta.env.VITE_SOCKET_URL || '', {
            auth: { token },
        });

        newSocket.on('connect', () => {
            console.log('🟢 Socket connected');
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
        });

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
