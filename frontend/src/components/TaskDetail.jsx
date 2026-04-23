import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TaskDetail = ({ taskId }) => {
  const [activeTab, setActiveTab] = useState('offers');
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Offer Modal State
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerError, setOfferError] = useState('');

  // Question State
  const [questionMessage, setQuestionMessage] = useState('');
  const [questionLoading, setQuestionLoading] = useState(false);
  const [questionError, setQuestionError] = useState('');

  // Get current user from local storage
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const currentUserId = userInfo ? userInfo._id : null;

  const fetchTask = async () => {
    if (!taskId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`);
      if (!response.ok) {
        throw new Error('Task not found');
      }
      const data = await response.json();
      setTask(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const submitOffer = async (e) => {
    e.preventDefault();
    if (!currentUserId) {
        setOfferError('You must be logged in to make an offer.');
        return;
    }
    
    setOfferLoading(true);
    setOfferError('');

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/tasks/${taskId}/offers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                price: Number(offerPrice),
                message: offerMessage
            })
        });

        const data = await response.json();

        if (response.ok) {
            setShowOfferModal(false);
            setOfferPrice('');
            setOfferMessage('');
            fetchTask(); // Refresh task data to show the new offer
            setActiveTab('offers');
        } else {
            setOfferError(data.message || 'Failed to submit offer');
        }
    } catch (err) {
        setOfferError('Network error. Please try again.');
    } finally {
        setOfferLoading(false);
    }
  };

  const submitQuestion = async () => {
    if (!currentUserId) {
        setQuestionError('You must be logged in to ask a question.');
        return;
    }
    if (!questionMessage.trim()) return;

    setQuestionLoading(true);
    setQuestionError('');

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/tasks/${taskId}/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                message: questionMessage
            })
        });

        const data = await response.json();

        if (response.ok) {
            setQuestionMessage('');
            fetchTask(); // Refresh task data to show the new question
        } else {
            setQuestionError(data.message || 'Failed to submit question');
        }
    } catch (err) {
        setQuestionError('Network error. Please try again.');
    } finally {
        setQuestionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white min-h-full p-6 flex justify-center items-center">
        <span className="w-8 h-8 border-4 border-[#0047fb] border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="bg-white min-h-full p-6 flex justify-center items-center text-red-500">
        <p>{error || 'Task not found'}</p>
      </div>
    );
  }

  // Formatting strings from task data
  let scheduleStr = 'Flexible';
  if (task.dateType === 'on_date') scheduleStr = `On ${task.selectedDate}`;
  if (task.dateType === 'before_date') scheduleStr = `Before ${task.selectedDate}`;
  
  const locationStr = task.locationType === 'online' ? 'Remote' : (task.suburb || 'In-person');
  
  // Format creation date loosely
  const dateObj = new Date(task.createdAt);
  const timeAgo = dateObj.toLocaleDateString();

  return (
    <div className="bg-white min-h-full p-6 flex justify-center relative">
      <div className="max-w-5xl w-full flex flex-col lg:flex-row gap-8">
        
        {/* Main Content (Left Column) */}
        <div className="flex-1">
          {/* Status Bar */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 text-xs font-bold">
              <span className={`px-3 py-1 rounded-full ${task.status === 'open' ? 'bg-green-200 text-green-800' : 'text-gray-400'}`}>OPEN</span>
              <span className={`px-3 py-1 rounded-full ${task.status === 'assigned' ? 'bg-blue-200 text-blue-800' : 'text-gray-400'}`}>ASSIGNED</span>
              <span className={`px-3 py-1 rounded-full ${task.status === 'completed' ? 'bg-gray-200 text-gray-800' : 'text-gray-400'}`}>COMPLETED</span>
            </div>
            <button className="flex items-center text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full text-sm font-semibold transition-colors">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              Follow
            </button>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{task.title}</h1>
          <Link to="/tasks" className="text-blue-600 hover:underline flex items-center text-sm mb-8 font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Return to map
          </Link>

          {/* Task Info List */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 text-blue-500 overflow-hidden shrink-0 mt-1">
                {task.user && task.user.avatar ? (
                   <img src={task.user.avatar} alt={task.user.firstName} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                )}
              </div>
              <div className="flex-1 border-b border-gray-100 pb-6 flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Posted by</p>
                  <p className="text-gray-900 font-medium">{task.user ? `${task.user.firstName} ${task.user.lastName ? task.user.lastName.charAt(0) + '.' : ''}` : 'Unknown'}</p>
                </div>
                <span className="text-sm text-gray-500">{timeAgo}</span>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 flex flex-col items-center justify-start pt-1 shrink-0 mr-4 text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div className="flex-1 border-b border-gray-100 pb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Location</p>
                <p className="text-gray-900 font-medium">{locationStr}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 flex flex-col items-center justify-start pt-1 shrink-0 mr-4 text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div className="flex-1 border-b border-gray-100 pb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">To be done on</p>
                <p className="text-gray-900 font-medium">{scheduleStr}</p>
                {task.selectedTime && (
                    <p className="text-gray-500 text-sm mt-1 capitalize">{task.selectedTime}</p>
                )}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Details</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{task.details}</p>
            <button className="text-blue-600 text-sm font-medium hover:underline mt-4">Less ^</button>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Tabs Section */}
          <div className="mb-8">
             <div className="flex bg-gray-100 rounded-full p-1 mb-6 max-w-sm mx-auto">
              <button 
                onClick={() => setActiveTab('offers')}
                className={`flex-1 py-3 text-center rounded-full font-bold text-sm transition-all ${activeTab === 'offers' ? 'bg-[#001D4A] text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
              >
                Offers {task.offers ? task.offers.length : 0}
              </button>
              <button 
                onClick={() => setActiveTab('questions')}
                 className={`flex-1 py-3 text-center rounded-full font-bold text-sm transition-all ${activeTab === 'questions' ? 'bg-[#001D4A] text-white shadow' : 'text-[#687383] hover:text-gray-800'}`}
              >
                Questions {task.questions ? task.questions.length : 0}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'offers' ? (
              <div className="space-y-6">
                {!task.offers || task.offers.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No offers yet. Be the first to make an offer!</p>
                ) : (
                  task.offers.map((offer) => {
                    // Privacy Logic: Show price only if currentUser is task owner OR offer creator
                    const isTaskOwner = currentUserId === task.user._id;
                    const isOfferCreator = currentUserId === offer.user._id;
                    const canSeePrice = isTaskOwner || isOfferCreator;

                    return (
                      <div key={offer._id} className="pb-6 border-b border-gray-100 last:border-0">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            {offer.user.avatar ? (
                              <img src={offer.user.avatar} alt={offer.user.firstName} className="w-12 h-12 rounded-full mr-3 object-cover" />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-500">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                              </div>
                            )}
                            <div>
                              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                {offer.user.firstName}
                                {offer.user.rating && (
                                  <span className="text-xs font-normal text-gray-600 flex items-center">
                                    {offer.user.rating} <span className="text-orange-500 mx-1">★</span>
                                  </span>
                                )}
                              </h4>
                            </div>
                          </div>
                          
                          {/* Offer Price display based on privacy rules */}
                          <div className="text-right">
                             {canSeePrice ? (
                                <div className="font-bold text-[#001D4A] text-lg">${offer.price}</div>
                             ) : (
                                <div className="text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Price Hidden</div>
                             )}
                          </div>
                        </div>
                        <div className="bg-[#F5F7FB] p-4 rounded-lg text-gray-800 text-sm mb-2 whitespace-pre-wrap">
                          {offer.message}
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span>{new Date(offer.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        {/* Replies Display */}
                        {offer.replies && offer.replies.length > 0 && (
                            <div className="ml-8 mt-3 space-y-3 border-l-2 border-gray-100 pl-4">
                                {offer.replies.map(r => (
                                    <div key={r._id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-900 text-sm">{r.user?.firstName} (Task Owner)</span>
                                            <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-700 text-sm">{r.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-start text-sm text-gray-500 mb-6 bg-white p-4 rounded border border-gray-100">
                  <svg className="w-5 h-5 mr-3 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  <p>These messages are public. Don't share private info. We never ask for payment, send links/QR codes, or request verification in Questions.</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {userInfo && userInfo.avatar ? (
                      <img src={userInfo.avatar} alt="You" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                    )}
                  </div>
                  <div className="flex-1 bg-[#F5F7FB] rounded-lg p-4 relative border border-transparent focus-within:border-[#0047fb] transition-colors">
                    <textarea 
                      placeholder="Ask a question" 
                      className="w-full bg-transparent border-none focus:outline-none resize-none text-gray-700 min-h-[60px]"
                      value={questionMessage}
                      onChange={(e) => setQuestionMessage(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-2">
                       <button className="text-gray-400 hover:text-gray-600">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                       </button>
                       <button 
                          onClick={submitQuestion}
                          disabled={questionLoading || !questionMessage.trim()}
                          className="text-[#0047fb] font-bold hover:text-blue-800 transition-colors disabled:opacity-50"
                       >
                         {questionLoading ? 'Sending...' : 'Send'}
                       </button>
                    </div>
                    {questionError && <p className="text-red-500 text-xs mt-2">{questionError}</p>}
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  {task.questions && task.questions.map(q => (
                     <div key={q._id} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden mt-1">
                          {q.user && q.user.avatar ? (
                            <img src={q.user.avatar} alt={q.user.firstName} className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                          )}
                        </div>
                        <div>
                           <div className="flex items-baseline gap-2 mb-1">
                             <span className="font-bold text-gray-900">{q.user ? q.user.firstName : 'Unknown'}</span>
                             <span className="text-xs text-gray-500">{new Date(q.createdAt).toLocaleDateString()}</span>
                           </div>
                           <p className="text-gray-800 text-sm whitespace-pre-wrap">{q.message}</p>
                           
                           {/* Replies Display */}
                           {q.replies && q.replies.length > 0 && (
                               <div className="mt-3 space-y-3 border-l-2 border-gray-100 pl-4">
                                   {q.replies.map(r => (
                                       <div key={r._id} className="bg-[#F5F7FB] p-3 rounded-lg border border-gray-100 shadow-sm">
                                           <div className="flex items-center gap-2 mb-1">
                                               <span className="font-bold text-gray-900 text-sm">{r.user?.firstName} (Task Owner)</span>
                                               <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                                           </div>
                                           <p className="text-gray-700 text-sm">{r.message}</p>
                                       </div>
                                   ))}
                               </div>
                           )}
                        </div>
                     </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="font-bold text-[#001D4A] mb-2">Cancellation policy</h3>
                  <p className="text-[#001D4A] text-sm mb-2">If you are responsible for cancelling this task, a Cancellation Fee will be deducted from your next payment payout(s).</p>
                  <a href="#" className="text-blue-600 text-sm hover:underline">Learn more</a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar (Budget Card) */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="bg-[#F5F7FB] rounded-xl p-6 mb-4 sticky top-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide text-center mb-1">Task Budget</p>
            <p className="text-5xl font-extrabold text-[#001D4A] text-center mb-6">${task.budget}</p>
            
            {currentUserId !== task.user._id && (
                <button 
                    onClick={() => setShowOfferModal(true)}
                    className="w-full bg-[#0057FF] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full transition-colors mb-6 shadow-md"
                >
                    Make an offer
                </button>
            )}
            
            <div className="relative">
              <button className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-[#001D4A] font-medium py-3 px-4 rounded-lg transition-colors flex justify-between items-center">
                More Options
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
            
            <button className="w-full text-center text-sm font-medium text-gray-400 hover:text-gray-600 mt-6 flex items-center justify-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
              Report this task
            </button>
          </div>
        </div>

      </div>

      {/* Offer Modal */}
      {showOfferModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-[#071343]">Make an offer</h2>
                      <button onClick={() => setShowOfferModal(false)} className="text-gray-400 hover:text-gray-700 transition">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>

                  <div className="p-6 overflow-y-auto">
                      <form id="offerForm" onSubmit={submitOffer}>
                          {offerError && (
                              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium mb-4">
                                  {offerError}
                              </div>
                          )}
                          
                          <div className="mb-6">
                              <label className="block text-[#071343] font-bold text-sm mb-2">
                                  Your Offer Price
                              </label>
                              <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                      <span className="text-[#071343] font-medium text-lg">$</span>
                                  </div>
                                  <input
                                      type="number"
                                      required
                                      className="w-full bg-[#f3f6ff] border-2 border-transparent focus:border-[#0047fb] rounded-xl pl-8 pr-4 py-3 text-gray-900 focus:outline-none transition font-medium"
                                      value={offerPrice}
                                      onChange={(e) => setOfferPrice(e.target.value)}
                                      placeholder="0"
                                      max={task.budget - 1} // Front-end validation to be less than budget
                                  />
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Must be less than the original budget (${task.budget}). Only the task owner will see this amount.</p>
                          </div>

                          <div className="mb-4">
                              <label className="block text-[#071343] font-bold text-sm mb-2">
                                  Why are you the best person for this task?
                              </label>
                              <textarea
                                  required
                                  maxLength={3000} // Rough equivalent of 500 words
                                  rows={5}
                                  placeholder="Share your experience and why you can get this done well..."
                                  className="w-full bg-[#f3f6ff] border-2 border-transparent focus:border-[#0047fb] rounded-xl p-4 text-gray-900 focus:outline-none transition resize-none"
                                  value={offerMessage}
                                  onChange={(e) => setOfferMessage(e.target.value)}
                              ></textarea>
                              <p className="text-xs text-gray-500 mt-2 text-right">Max 500 words</p>
                          </div>
                      </form>
                  </div>

                  <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                      <button 
                          type="button" 
                          onClick={() => setShowOfferModal(false)}
                          className="px-6 py-2.5 rounded-full font-bold text-gray-600 hover:bg-gray-200 transition"
                      >
                          Cancel
                      </button>
                      <button 
                          type="submit" 
                          form="offerForm"
                          disabled={offerLoading || !offerPrice || !offerMessage}
                          className="px-8 py-2.5 bg-[#0057FF] hover:bg-blue-700 text-white rounded-full font-bold transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                          {offerLoading ? (
                              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span> Submitting...</>
                          ) : 'Submit Offer'}
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default TaskDetail;
