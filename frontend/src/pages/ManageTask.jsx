import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ManageTask = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('offers');

    // Reply state
    const [replyingToOfferId, setReplyingToOfferId] = useState(null);
    const [replyingToQuestionId, setReplyingToQuestionId] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const fetchTask = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch task details');
            
            const data = await response.json();
            
            // Security check: Only the owner should manage this task
            if (data.user._id !== userInfo._id) {
                navigate('/tasks'); // Redirect if not owner
                return;
            }

            setTask(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTask();
    }, [taskId, navigate, userInfo?._id]);

    const handleAcceptOffer = async (offerId) => {
        if (!window.confirm("Are you sure you want to accept this offer?")) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/tasks/${taskId}/offers/${offerId}/accept`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                fetchTask(); // Refresh to see updated status
            } else {
                const data = await response.json();
                alert(data.message || "Failed to accept offer");
            }
        } catch (err) {
            alert("Network error occurred.");
        }
    };

    const submitReply = async (type, id) => {
        if (!replyMessage.trim()) return;
        setIsReplying(true);

        try {
            const token = localStorage.getItem('token');
            const endpoint = type === 'offer' 
                ? `/api/tasks/${taskId}/offers/${id}/reply`
                : `/api/tasks/${taskId}/questions/${id}/reply`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ message: replyMessage })
            });

            if (response.ok) {
                setReplyMessage('');
                setReplyingToOfferId(null);
                setReplyingToQuestionId(null);
                fetchTask(); // Refresh to show the new reply
            } else {
                const data = await response.json();
                alert(data.message || "Failed to submit reply");
            }
        } catch (err) {
            alert("Network error occurred.");
        } finally {
            setIsReplying(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
                <span className="w-12 h-12 border-4 border-[#0047fb] border-t-transparent rounded-full animate-spin"></span>
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="text-center text-red-500 min-h-[calc(100vh-80px)] flex items-center justify-center">
                <p>{error || "Task not found"}</p>
            </div>
        );
    }

    let scheduleStr = 'Flexible';
    if (task.dateType === 'on_date') scheduleStr = `On ${task.selectedDate}`;
    if (task.dateType === 'before_date') scheduleStr = `Before ${task.selectedDate}`;
    const locationStr = task.locationType === 'online' ? 'Remote' : (task.suburb || 'In-person');
    const offerCount = task.offers ? task.offers.length : 0;
    const questionCount = task.questions ? task.questions.length : 0;

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-80px)] font-sans">
            {/* Top Section */}
            <div className="bg-[#FAF9F5] py-12 px-6">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 justify-between items-start">
                    <div className="flex-1">
                        {offerCount > 0 && <p className="text-[#0047fb] font-bold text-sm mb-2 flex items-center"><span className="w-2 h-2 rounded-full bg-[#0047fb] mr-2"></span> New offers!</p>}
                        <h1 className="text-5xl font-extrabold text-[#001D4A] mb-4">
                            {offerCount === 0 ? "No offers yet" : `You have ${offerCount} offer${offerCount > 1 ? 's' : ''}`}
                        </h1>
                        <p className="text-gray-600 text-lg mb-6">
                            Discuss details with Taskers and accept an offer when you're ready.
                        </p>
                        <p className="text-gray-500 text-sm flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            181 views
                        </p>
                    </div>

                    {/* Task Summary Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full lg:w-[400px] shrink-0">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-[#001D4A] text-lg leading-tight">{task.title}</h3>
                                <p className="text-gray-500 text-sm">{locationStr}</p>
                            </div>
                            <div className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                        </div>

                        <div className="space-y-4 py-4 border-t border-gray-100">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Due Date</p>
                                    <p className="text-[#001D4A] font-bold text-sm">{scheduleStr}</p>
                                </div>
                                <button className="text-[#0047fb] text-sm font-semibold">Edit</button>
                            </div>
                            
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Price</p>
                                    <p className="text-[#001D4A] font-bold text-sm">${task.budget}</p>
                                </div>
                                <button className="text-[#0047fb] text-sm font-semibold">Edit</button>
                            </div>
                        </div>

                        <button className="flex items-center text-[#001D4A] font-bold text-sm mt-4 pt-4 border-t border-gray-100 w-full hover:text-gray-600">
                            <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                            More options
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Interaction Area */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="flex bg-gray-200 rounded-full p-1 mb-8">
                    <button 
                        onClick={() => setActiveTab('offers')}
                        className={`flex-1 py-3 text-center rounded-full font-bold text-sm transition-all ${activeTab === 'offers' ? 'bg-[#001D4A] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Offers <span className={activeTab === 'offers' ? 'text-blue-300' : 'text-gray-400'}>{offerCount}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('questions')}
                        className={`flex-1 py-3 text-center rounded-full font-bold text-sm transition-all ${activeTab === 'questions' ? 'bg-[#001D4A] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Questions <span className={activeTab === 'questions' ? 'text-blue-300' : 'text-gray-400'}>{questionCount}</span>
                    </button>
                </div>

                {/* Offers Tab Content */}
                {activeTab === 'offers' && (
                    <div className="space-y-6">
                        {offerCount === 0 ? (
                            <p className="text-center text-gray-500 py-12 bg-white rounded-xl border border-gray-200">No offers have been made on this task yet.</p>
                        ) : (
                            task.offers.map((offer) => (
                                <div key={offer._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
                                    {/* The Accept Button for Offers */}
                                    {task.status === 'open' && (
                                        <div className="absolute bottom-6 left-6 right-6 lg:static lg:float-right lg:ml-6 lg:mb-4 lg:w-32">
                                            <button 
                                                onClick={() => handleAcceptOffer(offer._id)}
                                                className="w-full bg-[#0057FF] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full transition-colors shadow-md lg:mt-0 mt-4"
                                            >
                                                Accept
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center">
                                            {offer.user?.avatar ? (
                                                <img src={offer.user.avatar} alt={offer.user.firstName} className="w-16 h-16 rounded-full mr-4 object-cover border border-gray-100 shadow-sm" />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4 text-blue-500">
                                                    <span className="text-xl font-bold">{offer.user?.firstName?.charAt(0)}</span>
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-[#001D4A] text-lg leading-tight flex items-center">
                                                    {offer.user?.firstName} {offer.user?.lastName?.charAt(0)}.
                                                </h4>
                                                <span className="text-xs font-bold text-[#0047fb]">New!</span>
                                            </div>
                                        </div>
                                        <div className="font-extrabold text-[#001D4A] text-2xl">${offer.price}</div>
                                    </div>

                                    <div className="bg-[#f3f6ff] p-4 rounded-lg text-gray-800 text-sm mb-4 whitespace-pre-wrap lg:mr-40">
                                        {offer.message}
                                    </div>

                                    <div className="flex items-center text-xs text-[#0047fb] font-semibold mb-4 cursor-pointer hover:underline"
                                         onClick={() => setReplyingToOfferId(replyingToOfferId === offer._id ? null : offer._id)}
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                        Reply
                                        <span className="text-gray-400 font-normal ml-2">• {new Date(offer.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    {/* Replies Display */}
                                    {offer.replies && offer.replies.length > 0 && (
                                        <div className="ml-10 mt-4 space-y-4 border-l-2 border-gray-100 pl-4">
                                            {offer.replies.map(r => (
                                                <div key={r._id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-gray-900 text-sm">{r.user?.firstName} {r.user?._id === userInfo._id && '(You)'}</span>
                                                        <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-gray-700 text-sm">{r.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Inline Reply Input */}
                                    {replyingToOfferId === offer._id && (
                                        <div className="mt-4 flex gap-3 ml-10">
                                            <input 
                                                type="text" 
                                                value={replyMessage}
                                                onChange={(e) => setReplyMessage(e.target.value)}
                                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#0047fb]"
                                                placeholder="Write a reply..."
                                                autoFocus
                                            />
                                            <button 
                                                onClick={() => submitReply('offer', offer._id)}
                                                disabled={isReplying || !replyMessage.trim()}
                                                className="bg-[#001D4A] hover:bg-[#0047fb] text-white px-6 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50"
                                            >
                                                Send
                                            </button>
                                        </div>
                                    )}
                                    
                                    {/* Spacer for absolute button on mobile */}
                                    {task.status === 'open' && <div className="h-16 lg:hidden"></div>}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Questions Tab Content */}
                {activeTab === 'questions' && (
                    <div className="space-y-6">
                        {questionCount === 0 ? (
                            <p className="text-center text-gray-500 py-12 bg-white rounded-xl border border-gray-200">No questions have been asked yet.</p>
                        ) : (
                            task.questions.map((q) => (
                                <div key={q._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center mb-3">
                                        {q.user?.avatar ? (
                                            <img src={q.user.avatar} alt={q.user.firstName} className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-100" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-500 text-sm font-bold">
                                                {q.user?.firstName?.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold text-[#001D4A] text-sm">
                                                {q.user?.firstName} {q.user?.lastName?.charAt(0)}.
                                            </div>
                                            <span className="text-xs text-gray-500">{new Date(q.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="text-gray-800 text-sm mb-4">
                                        {q.message}
                                    </div>

                                    <div className="flex items-center text-xs text-[#0047fb] font-semibold cursor-pointer hover:underline"
                                         onClick={() => setReplyingToQuestionId(replyingToQuestionId === q._id ? null : q._id)}
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                        Reply
                                    </div>

                                     {/* Replies Display */}
                                     {q.replies && q.replies.length > 0 && (
                                        <div className="mt-4 space-y-4 border-l-2 border-gray-100 pl-4 ml-6">
                                            {q.replies.map(r => (
                                                <div key={r._id} className="bg-[#f3f6ff] p-3 rounded-lg border border-blue-50 shadow-sm">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-[#001D4A] text-sm">{r.user?.firstName} {r.user?._id === userInfo._id && '(You)'}</span>
                                                        <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-gray-700 text-sm">{r.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Inline Reply Input */}
                                    {replyingToQuestionId === q._id && (
                                        <div className="mt-4 flex gap-3 ml-6">
                                            <input 
                                                type="text" 
                                                value={replyMessage}
                                                onChange={(e) => setReplyMessage(e.target.value)}
                                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#0047fb]"
                                                placeholder="Write a reply..."
                                                autoFocus
                                            />
                                            <button 
                                                onClick={() => submitReply('question', q._id)}
                                                disabled={isReplying || !replyMessage.trim()}
                                                className="bg-[#001D4A] hover:bg-[#0047fb] text-white px-6 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50"
                                            >
                                                Send
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageTask;
