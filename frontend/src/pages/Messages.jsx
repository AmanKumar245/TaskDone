import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useSocket from '../context/useSocket';
import axiosInstance from '../api/axios';

const Messages = () => {
    const { conversationId: activeConvoId } = useParams();
    const navigate = useNavigate();
    const socket = useSocket();

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [typingUser, setTypingUser] = useState(null);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const { userInfo } = useSelector((state) => state.auth);

    // Fetch conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const { data } = await axiosInstance.get('/messages/conversations');
                setConversations(data);
            } catch (err) {
                console.error('Error fetching conversations:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConversations();
    }, []);

    // Fetch messages for active conversation
    useEffect(() => {
        if (!activeConvoId) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            try {
                const { data } = await axiosInstance.get(`/messages/${activeConvoId}`);
                setMessages(data);
            } catch (err) {
                console.error('Error fetching messages:', err);
            }
        };
        fetchMessages();
    }, [activeConvoId]);

    // Socket.IO: join room + listen for messages
    useEffect(() => {
        if (!socket || !activeConvoId) return;

        socket.emit('join_room', activeConvoId);

        const handleReceiveMessage = (message) => {
            setMessages(prev => [...prev, message]);

            // Update conversation's last message in sidebar
            setConversations(prev => prev.map(c => {
                if (c._id === activeConvoId) {
                    return {
                        ...c,
                        lastMessage: {
                            text: message.text,
                            sender: message.sender._id,
                            createdAt: message.createdAt,
                        }
                    };
                }
                return c;
            }));
        };

        const handleTyping = ({ userId, firstName, isTyping }) => {
            if (userId !== userInfo._id) {
                setTypingUser(isTyping ? firstName : null);
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('user_typing', handleTyping);

        return () => {
            socket.emit('leave_room', activeConvoId);
            socket.off('receive_message', handleReceiveMessage);
            socket.off('user_typing', handleTyping);
        };
    }, [socket, activeConvoId, userInfo._id]);

    // Lock body scroll so the page doesn't scroll past messages to the footer
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Auto-scroll within the messages container only (not the whole page)
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConvoId) return;

        setIsSending(true);
        try {
            if (socket && socket.connected) {
                socket.emit('send_message', {
                    conversationId: activeConvoId,
                    text: newMessage.trim(),
                });
            } else {
                // REST fallback
                await axiosInstance.post(`/messages/${activeConvoId}`, { text: newMessage.trim() });
            }
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setIsSending(false);
        }
    };

    const handleTyping = () => {
        if (!socket || !activeConvoId) return;

        socket.emit('typing', { conversationId: activeConvoId, isTyping: true });

        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('typing', { conversationId: activeConvoId, isTyping: false });
        }, 1500);
    };

    const getOtherParticipant = (convo) => {
        return convo.participants?.find(p => p._id !== userInfo._id);
    };

    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return d.toLocaleDateString();
    };

    const activeConvo = conversations.find(c => c._id === activeConvoId);
    const otherUser = activeConvo ? getOtherParticipant(activeConvo) : null;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
                <span className="w-12 h-12 border-4 border-[#0047fb] border-t-transparent rounded-full animate-spin"></span>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            height: 'calc(100vh - 64px)',
            background: '#f8f9fc',
            overflow: 'hidden',
        }}>
            {/* Left Sidebar — Conversation List */}
            <div style={{
                width: '360px',
                borderRight: '1px solid #e5e7eb',
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
            }}>
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #e5e7eb',
                }}>
                    <h2 style={{
                        fontSize: '22px',
                        fontWeight: '800',
                        color: '#001D4A',
                        margin: 0,
                    }}>Messages</h2>
                </div>

                <div style={{ overflowY: 'auto', flex: 1 }}>
                    {conversations.length === 0 ? (
                        <div style={{
                            padding: '40px 24px',
                            textAlign: 'center',
                            color: '#9ca3af',
                        }}>
                            <svg style={{ margin: '0 auto 16px', width: '48px', height: '48px', color: '#d1d5db' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p style={{ fontSize: '14px', fontWeight: '600' }}>No conversations yet</p>
                            <p style={{ fontSize: '13px', marginTop: '4px' }}>Accept an offer to start chatting</p>
                        </div>
                    ) : (
                        conversations.map(convo => {
                            const other = getOtherParticipant(convo);
                            const isActive = convo._id === activeConvoId;

                            return (
                                <div
                                    key={convo._id}
                                    onClick={() => navigate(`/messages/${convo._id}`)}
                                    style={{
                                        padding: '16px 24px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        background: isActive ? '#f0f4ff' : 'transparent',
                                        borderLeft: isActive ? '3px solid #0047fb' : '3px solid transparent',
                                        transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={e => {
                                        if (!isActive) e.currentTarget.style.background = '#f9fafb';
                                    }}
                                    onMouseLeave={e => {
                                        if (!isActive) e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    {/* Avatar */}
                                    {other?.avatar ? (
                                        <img src={other.avatar} alt="" style={{
                                            width: '44px', height: '44px', borderRadius: '50%',
                                            objectFit: 'cover', border: '2px solid #e5e7eb', flexShrink: 0,
                                        }} />
                                    ) : (
                                        <div style={{
                                            width: '44px', height: '44px', borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#fff', fontWeight: '700', fontSize: '16px', flexShrink: 0,
                                        }}>
                                            {other?.firstName?.charAt(0)}
                                        </div>
                                    )}

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{
                                                fontWeight: '700', fontSize: '14px', color: '#001D4A',
                                            }}>
                                                {other?.firstName} {other?.lastName}
                                            </span>
                                            <span style={{
                                                fontSize: '11px', color: '#9ca3af', flexShrink: 0,
                                            }}>
                                                {convo.lastMessage?.createdAt ? formatTime(convo.lastMessage.createdAt) : ''}
                                            </span>
                                        </div>
                                        <p style={{
                                            fontSize: '12px', color: '#6b7280', fontWeight: '500',
                                            margin: '2px 0 0 0',
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        }}>
                                            {convo.task?.title}
                                        </p>
                                        <p style={{
                                            fontSize: '12px', color: '#9ca3af',
                                            margin: '2px 0 0 0',
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        }}>
                                            {convo.lastMessage?.text || 'No messages yet'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right Panel — Chat */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
            }}>
                {!activeConvoId ? (
                    /* Empty state */
                    <div style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column', color: '#9ca3af',
                    }}>
                        <svg style={{ width: '64px', height: '64px', color: '#d1d5db', marginBottom: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p style={{ fontSize: '16px', fontWeight: '700', color: '#374151' }}>Select a conversation</p>
                        <p style={{ fontSize: '13px', marginTop: '4px' }}>Choose a conversation from the left to start messaging</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div style={{
                            padding: '16px 24px',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: '#fff',
                        }}>
                            {otherUser?.avatar ? (
                                <img src={otherUser.avatar} alt="" style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    objectFit: 'cover', border: '2px solid #e5e7eb',
                                }} />
                            ) : (
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontWeight: '700', fontSize: '15px',
                                }}>
                                    {otherUser?.firstName?.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h3 style={{
                                    fontSize: '15px', fontWeight: '700', color: '#001D4A', margin: 0,
                                }}>
                                    {otherUser?.firstName} {otherUser?.lastName}
                                </h3>
                                <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>
                                    {activeConvo?.task?.title} • ₹{activeConvo?.task?.budget}
                                </p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={messagesContainerRef}
                            style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            background: '#f8f9fc',
                            minHeight: 0,
                        }}>
                            {messages.length === 0 && (
                                <div style={{
                                    textAlign: 'center', color: '#9ca3af', paddingTop: '40px',
                                }}>
                                    <p style={{ fontSize: '14px', fontWeight: '600' }}>Start the conversation!</p>
                                    <p style={{ fontSize: '13px' }}>Say hello and discuss the task details.</p>
                                </div>
                            )}

                            {messages.map((msg, index) => {
                                const isMine = msg.sender._id === userInfo._id;
                                const showAvatar = !isMine && (
                                    index === 0 || messages[index - 1]?.sender._id !== msg.sender._id
                                );

                                return (
                                    <div
                                        key={msg._id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: isMine ? 'flex-end' : 'flex-start',
                                            alignItems: 'flex-end',
                                            gap: '8px',
                                        }}
                                    >
                                        {!isMine && (
                                            <div style={{ width: '28px', flexShrink: 0 }}>
                                                {showAvatar && (
                                                    msg.sender.avatar ? (
                                                        <img src={msg.sender.avatar} alt="" style={{
                                                            width: '28px', height: '28px', borderRadius: '50%',
                                                            objectFit: 'cover',
                                                        }} />
                                                    ) : (
                                                        <div style={{
                                                            width: '28px', height: '28px', borderRadius: '50%',
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: '#fff', fontWeight: '700', fontSize: '11px',
                                                        }}>
                                                            {msg.sender.firstName?.charAt(0)}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}

                                        <div style={{
                                            maxWidth: '65%',
                                            padding: '10px 16px',
                                            borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                            background: isMine
                                                ? 'linear-gradient(135deg, #0047fb 0%, #0035c1 100%)'
                                                : '#fff',
                                            color: isMine ? '#fff' : '#1f2937',
                                            fontSize: '14px',
                                            lineHeight: '1.5',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                            wordBreak: 'break-word',
                                        }}>
                                            {msg.text}
                                            <div style={{
                                                fontSize: '10px',
                                                marginTop: '4px',
                                                textAlign: 'right',
                                                color: isMine ? 'rgba(255,255,255,0.6)' : '#9ca3af',
                                            }}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Typing indicator */}
                            {typingUser && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '4px 0',
                                }}>
                                    <div style={{
                                        background: '#e5e7eb', borderRadius: '18px',
                                        padding: '8px 16px', fontSize: '13px', color: '#6b7280',
                                        fontStyle: 'italic',
                                    }}>
                                        {typingUser} is typing
                                        <span style={{ animation: 'pulse 1.5s infinite' }}>...</span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <form
                            onSubmit={handleSendMessage}
                            style={{
                                padding: '16px 24px',
                                borderTop: '1px solid #e5e7eb',
                                display: 'flex',
                                gap: '12px',
                                alignItems: 'center',
                                background: '#fff',
                            }}
                        >
                            <input
                                type="text"
                                value={newMessage}
                                onChange={e => {
                                    setNewMessage(e.target.value);
                                    handleTyping();
                                }}
                                placeholder="Type a message..."
                                style={{
                                    flex: 1,
                                    padding: '12px 20px',
                                    borderRadius: '24px',
                                    border: '1px solid #e5e7eb',
                                    fontSize: '14px',
                                    outline: 'none',
                                    background: '#f9fafb',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#0047fb'}
                                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                            />
                            <button
                                type="submit"
                                disabled={isSending || !newMessage.trim()}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    background: newMessage.trim() ? 'linear-gradient(135deg, #0047fb 0%, #0035c1 100%)' : '#e5e7eb',
                                    color: newMessage.trim() ? '#fff' : '#9ca3af',
                                    border: 'none',
                                    cursor: newMessage.trim() ? 'pointer' : 'default',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    flexShrink: 0,
                                }}
                            >
                                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Messages;
