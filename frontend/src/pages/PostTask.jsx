import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../api/axios';

// Custom Date Picker component to perfectly match Airtasker's UI
const CustomDatePicker = ({ selectedDate, onSelectDate, onClose }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Prevent clicks inside the calendar from closing it
    const handlePopupClick = (e) => e.stopPropagation();

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => {
        let day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1; // 0=Mon, 6=Sun
    };

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);
    
    // Previous month info for padding
    const prevMonthDays = getDaysInMonth(year, month - 1);
    
    const days = [];
    
    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, isCurrentMonth: true });
    }
    
    // Next month padding to fill 6 rows of 7 (42 total days)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        days.push({ day: i, isCurrentMonth: false });
    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handleNextMonth = () => {
        setCurrentMonth(new Date(year, month + 1, 1));
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(year, month - 1, 1));
    };

    const handleSelectDay = (day) => {
        const dateStr = `${monthNames[month].substring(0, 3)} ${day}`; // e.g. "Mar 29"
        onSelectDate(dateStr);
        onClose();
    };

    // Check if a day is the currently selected date
    const isDaySelected = (day) => {
        return selectedDate === `${monthNames[month].substring(0, 3)} ${day}`;
    };

    return (
        <div 
            className="absolute top-full left-0 mt-3 w-[320px] bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-gray-100 z-50 p-5 animate-fade-in text-[#071343] font-sans"
            onClick={handlePopupClick}
        >
            {/* Header: Month & Navigation */}
            <div className="flex justify-between items-center mb-5 px-2">
                <button type="button" onClick={handlePrevMonth} className="text-[#071343] hover:bg-gray-100 rounded-full p-1 transition">
                    <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
                <span className="font-bold text-[16px]">{monthNames[month]} {year}</span>
                <button type="button" onClick={handleNextMonth} className="text-[#071343] hover:bg-gray-100 rounded-full p-1 transition">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
            
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[13px] font-bold text-[#071343] mb-3 bg-[#f3f6ff] py-2.5 rounded-lg">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-[14px] font-medium">
                {days.map((d, i) => {
                    const isSelected = d.isCurrentMonth && isDaySelected(d.day);
                    return (
                        <button 
                            key={i} 
                            type="button"
                            disabled={!d.isCurrentMonth}
                            onClick={() => d.isCurrentMonth && handleSelectDay(d.day)}
                            className={`w-9 h-9 flex items-center justify-center mx-auto rounded-full transition-colors 
                                ${!d.isCurrentMonth ? 'text-gray-300 cursor-not-allowed' : 
                                  isSelected ? 'bg-[#0047fb] text-white font-bold shadow-md' : 'text-[#071343] hover:bg-blue-50'}`}
                        >
                            {d.day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const PostTask = () => {
    const [step, setStep] = useState(1);
    const [attemptedStep, setAttemptedStep] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useSelector((state) => state.auth);

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [navigate, token]);
    
    // Step 1: Title & Date
    const [title, setTitle] = useState('');
    const [dateType, setDateType] = useState('on_date'); // 'on_date', 'before_date', 'flexible'
    const [selectedDate, setSelectedDate] = useState(''); // e.g. "Mar 29"
    const [showPicker, setShowPicker] = useState(null); // 'on_date' or 'before_date'
    const [certainTime, setCertainTime] = useState(false);
    const [selectedTime, setSelectedTime] = useState(''); // 'morning', 'midday', 'afternoon', 'evening'
    
    // Step 2: Location
    const [locationType, setLocationType] = useState(''); // 'in_person', 'online'
    const [suburb, setSuburb] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');

    useEffect(() => {
        const fetchLocation = async () => {
            setIsLoadingLocation(true);
            setLocationError('');
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${suburb}`);
                const data = await response.json();
                if (data && data[0] && data[0].Status === 'Success') {
                    setSuggestions(data[0].PostOffice);
                } else {
                    setSuggestions([]);
                    setLocationError('Invalid Pincode or details not found');
                }
            } catch (err) {
                console.error("Location fetch error:", err);
                setSuggestions([]);
                setLocationError('Error fetching location data');
            } finally {
                setIsLoadingLocation(false);
            }
        };

        if (/^\d{6}$/.test(suburb)) {
            fetchLocation();
        } else {
            setSuggestions([]);
            setLocationError('');
        }
    }, [suburb]);

    const handleSelectSuggestion = (po) => {
        const formattedLocation = `${po.Name}, ${po.District}, ${po.State} ${po.Pincode}`;
        setSuburb(formattedLocation);
        setSuggestions([]);
    };

    // Step 3: Details
    const [details, setDetails] = useState('');

    // Step 4: Budget
    const [budget, setBudget] = useState('');

    const canGoNextStep1 = title.trim() !== '' && dateType !== '' && (dateType === 'flexible' || selectedDate !== '');
    const canGoNextStep2 = locationType === 'online' || (locationType === 'in_person' && suburb.trim() !== '');
    const canGoNextStep3 = details.trim() !== '';
    const canGoNextStep4 = budget.trim() !== '';

    const handleNext = () => {
        if (step === 1 && !canGoNextStep1) { setAttemptedStep(true); return; }
        if (step === 2 && !canGoNextStep2) { setAttemptedStep(true); return; }
        if (step === 3 && !canGoNextStep3) { setAttemptedStep(true); return; }
        if (step === 4 && !canGoNextStep4) { setAttemptedStep(true); return; }

        setAttemptedStep(false);
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        setAttemptedStep(false);
        if (step > 1) setStep(step - 1);
    };

    const handlePostTask = async () => {
        if (!canGoNextStep4) {
            setAttemptedStep(true);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (!token) {
                navigate('/login');
                return;
            }

            const taskData = {
                title,
                dateType,
                selectedDate,
                certainTime,
                selectedTime,
                locationType,
                suburb,
                details,
                budget: Number(budget)
            };

            await axiosInstance.post('/tasks', taskData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setShowPicker(null);
        if (showPicker) window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [showPicker]);


    let headerText = "Let's start with the basics";
    if (step === 2) headerText = "Tell us where";
    if (step === 3) headerText = "Provide more details";
    if (step === 4) headerText = "Suggest your budget";

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/* Custom Minimal Header */}
            <header className="border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 bg-white z-50">
                <Link to="/" className="text-[#0047fb] font-black text-3xl tracking-tighter">
                    Airtasker
                </Link>
                <Link to="/" className="text-gray-500 hover:text-gray-900 transition p-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </Link>
            </header>

            {/* Main Layout */}
            <div className="flex-grow flex flex-col md:flex-row max-w-6xl mx-auto w-full">

                {/* Left Sidebar */}
                <aside className="hidden md:block w-1/4 py-12 px-8 border-r border-gray-100">
                    <div className="text-[#071343] text-lg font-bold mb-8">Post a task</div>
                    <nav className="space-y-6">
                        <div className="flex items-center cursor-pointer" onClick={() => { if (step > 1) { setStep(1); setAttemptedStep(false); } }}>
                            <div className={`w-1 h-6 mr-4 transition-colors ${step === 1 ? 'bg-[#0047fb] rounded-r-md' : 'bg-transparent'}`}></div>
                            <span className={`font-bold text-sm transition-colors ${step === 1 ? 'text-[#071343]' : 'text-gray-400 hover:text-gray-600'}`}>Title & Date</span>
                        </div>
                        <div className="flex items-center cursor-pointer" onClick={() => { if (step > 2 || (step === 1 && canGoNextStep1)) { setStep(2); setAttemptedStep(false); } }}>
                            <div className={`w-1 h-6 mr-4 transition-colors ${step === 2 ? 'bg-[#0047fb] rounded-r-md' : 'bg-transparent'}`}></div>
                            <span className={`font-bold text-sm transition-colors ${step === 2 ? 'text-[#071343]' : 'text-gray-400 hover:text-gray-600'}`}>Location</span>
                        </div>
                        <div className="flex items-center cursor-pointer" onClick={() => { if (step > 3 || (step === 2 && canGoNextStep2)) { setStep(3); setAttemptedStep(false); } }}>
                            <div className={`w-1 h-6 mr-4 transition-colors ${step === 3 ? 'bg-[#0047fb] rounded-r-md' : 'bg-transparent'}`}></div>
                            <span className={`font-bold text-sm transition-colors ${step === 3 ? 'text-[#071343]' : 'text-gray-400 hover:text-gray-600'}`}>Details</span>
                        </div>
                        <div className="flex items-center cursor-pointer" onClick={() => { if (step === 4 || (step === 3 && canGoNextStep3)) { setStep(4); setAttemptedStep(false); } }}>
                            <div className={`w-1 h-6 mr-4 transition-colors ${step === 4 ? 'bg-[#0047fb] rounded-r-md' : 'bg-transparent'}`}></div>
                            <span className={`font-bold text-sm transition-colors ${step === 4 ? 'text-[#071343]' : 'text-gray-400 hover:text-gray-600'}`}>Budget</span>
                        </div>
                    </nav>
                </aside>

                {/* Form Content */}
                <main className="w-full md:w-3/4 py-12 px-6 md:px-16 flex flex-col">
                    <h1 className="text-4xl md:text-[44px] font-black tracking-tighter text-[#071343] mb-12 leading-tight transition-all">
                        {headerText}
                    </h1>

                    <form className="flex-grow flex flex-col" onSubmit={(e) => e.preventDefault()}>

                        {/* STEP 1: Title & Date */}
                        {step === 1 && (
                            <>
                                <div className="mb-10">
                                    <label className="block text-[#071343] font-bold text-base mb-3">
                                        In a few words, what do you need done?
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Help move my sofa"
                                        className={`w-full bg-[#f3f6ff] border ${attemptedStep && title.trim() === '' ? 'border-orange-500' : 'border-transparent focus:border-[#0047fb]'} rounded-xl px-4 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0047fb] transition shadow-sm text-base`}
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    {attemptedStep && title.trim() === '' && (
                                        <p className="text-orange-500 font-medium text-sm mt-2 animate-fade-in">
                                            This field is required
                                        </p>
                                    )}
                                </div>

                                <div className="mb-8 relative z-20">
                                    <label className="block text-[#071343] font-bold text-base mb-4">
                                        When do you need this done?
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        
                                        {/* On Date Button */}
                                        <div className="relative">
                                            <button 
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDateType('on_date');
                                                    setShowPicker(showPicker === 'on_date' ? null : 'on_date');
                                                }}
                                                className={`border px-5 py-2.5 rounded-full font-bold text-sm transition flex items-center gap-2 cursor-pointer ${dateType === 'on_date' ? 'bg-[#071343] text-white border-[#071343]' : 'border-[#071343] text-[#071343] bg-white hover:bg-gray-50'}`}
                                            >
                                                <span className="whitespace-nowrap">
                                                    {dateType === 'on_date' && selectedDate ? `On ${selectedDate}` : 'On date'}
                                                </span>
                                                <svg className={`w-4 h-4 transition-transform ${showPicker === 'on_date' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            
                                            {showPicker === 'on_date' && (
                                                <CustomDatePicker 
                                                    selectedDate={dateType === 'on_date' ? selectedDate : ''} 
                                                    onSelectDate={setSelectedDate} 
                                                    onClose={() => setShowPicker(null)} 
                                                />
                                            )}
                                        </div>

                                        {/* Before Date Button */}
                                        <div className="relative">
                                            <button 
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDateType('before_date');
                                                    setShowPicker(showPicker === 'before_date' ? null : 'before_date');
                                                }}
                                                className={`border px-5 py-2.5 rounded-full font-bold text-sm transition flex items-center gap-2 cursor-pointer ${dateType === 'before_date' ? 'bg-[#071343] text-white border-[#071343]' : 'border-[#071343] text-[#071343] bg-white hover:bg-gray-50'}`}
                                            >
                                                <span className="whitespace-nowrap">
                                                    {dateType === 'before_date' && selectedDate ? `Before ${selectedDate}` : 'Before date'}
                                                </span>
                                                <svg className={`w-4 h-4 transition-transform ${showPicker === 'before_date' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {showPicker === 'before_date' && (
                                                <CustomDatePicker 
                                                    selectedDate={dateType === 'before_date' ? selectedDate : ''} 
                                                    onSelectDate={setSelectedDate} 
                                                    onClose={() => setShowPicker(null)} 
                                                />
                                            )}
                                        </div>

                                        <button 
                                            type="button" 
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                setDateType('flexible'); 
                                                setSelectedDate(''); 
                                                setShowPicker(null); 
                                            }}
                                            className={`border px-6 py-2.5 rounded-full font-bold text-sm transition shadow-sm ${dateType === 'flexible' ? 'bg-[#071343] text-white border-[#071343]' : 'border-[#071343] text-[#071343] bg-white hover:bg-gray-50'}`}
                                        >
                                            I'm flexible
                                        </button>
                                    </div>
                                    
                                    {/* Validation hint for dates */}
                                    {attemptedStep && dateType !== 'flexible' && !selectedDate && (
                                        <p className="text-orange-500 font-medium text-sm mt-3 animate-fade-in">
                                            Please select a date from the calendar.
                                        </p>
                                    )}
                                </div>

                                <div className="mb-auto pb-12 z-10 relative">
                                    <label className="flex items-center gap-3 cursor-pointer group mb-6" onClick={(e) => { e.preventDefault(); setCertainTime(!certainTime); }}>
                                        <div className={`w-5 h-5 flex items-center justify-center rounded-[4px] transition-colors shadow-sm ${certainTime ? 'bg-[#0047fb] border-[#0047fb]' : 'bg-white border-2 border-gray-300 group-hover:border-[#0047fb]'}`}>
                                            {certainTime && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <span className="text-[#071343] font-medium text-[15px]">
                                            I need a certain time of day
                                        </span>
                                    </label>
                                    
                                    {certainTime && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
                                            <button 
                                                type="button"
                                                onClick={() => setSelectedTime('morning')}
                                                className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all ${selectedTime === 'morning' ? 'border-[#071343] bg-white' : 'border-transparent bg-[#f3f6ff] hover:border-gray-200'}`}
                                            >
                                                <svg className={`w-8 h-8 mb-2 ${selectedTime === 'morning' ? 'text-[#071343]' : 'text-[#6b7280]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 18h16" />
                                                </svg>
                                                <span className="font-bold text-[#071343] text-[15px] mb-1">Morning</span>
                                                <span className="text-gray-500 text-sm">Before 10am</span>
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setSelectedTime('midday')}
                                                className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all ${selectedTime === 'midday' ? 'border-[#071343] bg-white' : 'border-transparent bg-[#f3f6ff] hover:border-gray-200'}`}
                                            >
                                                <svg className={`w-8 h-8 mb-2 ${selectedTime === 'midday' ? 'text-[#071343]' : 'text-[#6b7280]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                                <span className="font-bold text-[#071343] text-[15px] mb-1">Midday</span>
                                                <span className="text-gray-500 text-sm">10am - 2pm</span>
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setSelectedTime('afternoon')}
                                                className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all ${selectedTime === 'afternoon' ? 'border-[#071343] bg-white' : 'border-transparent bg-[#f3f6ff] hover:border-gray-200'}`}
                                            >
                                                <svg className={`w-8 h-8 mb-2 ${selectedTime === 'afternoon' ? 'text-[#071343]' : 'text-[#6b7280]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 15h16" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 18h16" />
                                                </svg>
                                                <span className="font-bold text-[#071343] text-[15px] mb-1">Afternoon</span>
                                                <span className="text-gray-500 text-sm">2pm - 6pm</span>
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setSelectedTime('evening')}
                                                className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all ${selectedTime === 'evening' ? 'border-[#071343] bg-white' : 'border-transparent bg-[#f3f6ff] hover:border-gray-200'}`}
                                            >
                                                <svg className={`w-8 h-8 mb-2 ${selectedTime === 'evening' ? 'text-[#071343]' : 'text-[#6b7280]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                                </svg>
                                                <span className="font-bold text-[#071343] text-[15px] mb-1">Evening</span>
                                                <span className="text-gray-500 text-sm">After 6pm</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* STEP 2: Location */}
                        {step === 2 && (
                            <>
                                <div className="flex flex-col md:flex-row gap-4 mb-10 mt-2">
                                    <button 
                                        type="button"
                                        onClick={() => setLocationType('in_person')}
                                        className={`flex-1 rounded-xl p-6 text-center border-2 transition-all ${locationType === 'in_person' ? 'border-[#071343] bg-[#071343] text-white' : 'border-gray-100 bg-[#f3f6ff] text-[#071343] hover:border-[#071343]'}`}
                                    >
                                        <div className="flex justify-center mb-3">
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="font-bold text-lg mb-1">In-person</div>
                                        <div className={`text-sm ${locationType === 'in_person' ? 'text-gray-200' : 'text-gray-500'}`}>Select this if you need the Tasker physically there</div>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setLocationType('online')}
                                        className={`flex-1 rounded-xl p-6 text-center border-2 transition-all ${locationType === 'online' ? 'border-[#071343] bg-[#071343] text-white' : 'border-gray-100 bg-[#f3f6ff] text-[#071343] hover:border-[#071343]'}`}
                                    >
                                        <div className="flex justify-center mb-3">
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="font-bold text-lg mb-1">Online</div>
                                        <div className={`text-sm ${locationType === 'online' ? 'text-gray-200' : 'text-gray-500'}`}>Select this if the Tasker can do it from home</div>
                                    </button>
                                </div>
                                
                                {locationType === 'in_person' && (
                                    <div className="mb-auto pb-12 animate-fade-in">
                                        <label className="block text-[#071343] font-bold text-base mb-3">
                                            Where do you need this done?   
                                        </label>
                                        <div className="flex flex-col relative">
                                            <div className="relative w-full">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Enter suburb or pincode"
                                                    className={`w-full bg-[#f3f6ff] border-2 ${attemptedStep && suburb.trim() === '' ? 'border-orange-500' : 'border-transparent focus:border-[#0047fb]'} rounded-xl pl-11 pr-4 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0047fb] transition text-base`}
                                                    value={suburb}
                                                    onChange={(e) => setSuburb(e.target.value)}
                                                />
                                            </div>
                                            {/* Suggestions Dropdown */}
                                            {suggestions.length > 0 && (
                                                <div className="absolute top-16 left-0 right-0 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-gray-100 max-h-60 overflow-y-auto z-50">
                                                    {suggestions.map((po, index) => (
                                                        <div 
                                                            key={index}
                                                            onClick={() => handleSelectSuggestion(po)}
                                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center gap-3 transition-colors"
                                                        >
                                                            <div className="w-8 h-8 rounded-full bg-[#f3f6ff] flex items-center justify-center flex-shrink-0">
                                                                <svg className="h-4 w-4 text-[#0047fb]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-gray-900 text-[15px]">{po.Name}</div>
                                                                <div className="text-sm text-gray-500">{po.District}, {po.State} {po.Pincode}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {isLoadingLocation && (
                                            <p className="text-gray-500 font-medium text-sm mt-2 animate-fade-in flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#0047fb]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Fetching location details...
                                            </p>
                                        )}
                                        {locationError && (
                                            <p className="text-orange-500 font-medium text-sm mt-2 animate-fade-in">
                                                {locationError}
                                            </p>
                                        )}
                                        {attemptedStep && suburb.trim() === '' && !locationError && (
                                            <p className="text-orange-500 font-medium text-sm mt-2 animate-fade-in">
                                                Please enter a suburb or pincode
                                            </p>
                                        )}
                                    </div>
                                )}
                                {locationType !== 'in_person' && (
                                    <div className="mb-auto pb-12">
                                        {attemptedStep && locationType === '' && (
                                            <p className="text-orange-500 font-medium text-sm mt-2 animate-fade-in">
                                                Please select a location type
                                            </p>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {/* STEP 3: Details */}
                        {step === 3 && (
                            <>
                                <div className="mb-8">
                                    <label className="block text-[#071343] font-bold text-base mb-3">
                                        What are the details?
                                    </label>
                                    <textarea
                                        placeholder="Write a summary of the key details"
                                        className={`w-full bg-[#f3f6ff] border-2 ${attemptedStep && details.trim() === '' ? 'border-orange-500' : 'border-transparent focus:border-[#0047fb]'} rounded-xl px-4 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0047fb] transition shadow-sm text-base min-h-[160px] resize-y`}
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                    ></textarea>
                                    {attemptedStep && details.trim() === '' && (
                                        <p className="text-orange-500 font-medium text-sm mt-2 animate-fade-in">
                                            This field is required
                                        </p>
                                    )}
                                </div>
                                <div className="mb-auto pb-12">
                                    <label className="block text-[#071343] font-bold text-base mb-3">
                                        Add images <span className="text-gray-500 font-normal text-sm">(optional)</span>
                                    </label>
                                    <button type="button" className="w-24 h-24 bg-[#f3f6ff] rounded-xl flex items-center justify-center hover:bg-[#e4ebf8] transition group border border-transparent hover:border-[#0047fb]">
                                        <svg className="w-8 h-8 text-[#0047fb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                </div>
                            </>
                        )}

                        {/* STEP 4: Budget */}
                        {step === 4 && (
                            <>
                                <div className="mb-auto pb-12">
                                    <label className="block text-[#071343] font-bold text-base mb-1">
                                        What is your budget?
                                    </label>
                                    <p className="text-gray-500 text-sm mb-4">
                                        You can always negotiate the final price.
                                    </p>
                                    <div className="relative max-w-sm">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-[#071343] font-medium text-lg">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            className={`w-full bg-[#f3f6ff] border-2 ${attemptedStep && budget.trim() === '' ? 'border-orange-500' : 'border-[#0047fb]'} rounded-xl pl-8 pr-4 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition text-lg font-medium shadow-sm`}
                                            value={budget}
                                            onChange={(e) => setBudget(e.target.value)}
                                        />
                                    </div>
                                    {attemptedStep && budget.trim() === '' && (
                                        <p className="text-orange-500 font-medium text-sm mt-2 animate-fade-in">
                                            Please set your budget
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Next / Back Button Footer */}
                        <div className="fixed bottom-0 left-0 right-0 md:static md:w-full bg-white p-4 md:p-0 border-t border-gray-200 md:border-none md:mt-12 flex flex-col items-center">
                            {error && (
                                <div className="w-full max-w-lg mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center">
                                    {error}
                                </div>
                            )}
                            <div className="flex justify-center gap-4 w-full">
                                {step > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={handleBack} 
                                        disabled={isLoading}
                                        className="flex-1 md:w-auto md:px-12 max-w-[200px] bg-[#f3f6ff] text-[#0047fb] py-4 rounded-full font-bold text-lg hover:bg-[#e4ebf8] transition disabled:opacity-50"
                                    >
                                        Back
                                    </button>
                                )}
                                
                                {step < 4 ? (
                                    <button 
                                        type="button" 
                                        onClick={handleNext} 
                                        className="flex-1 md:w-auto md:px-14 max-w-sm text-white py-4 rounded-full font-bold text-lg transition shadow-md bg-[#0047fb] hover:bg-blue-700"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button 
                                        type="button" 
                                        className="flex-1 md:w-auto md:px-14 max-w-sm text-white py-4 rounded-full font-bold text-lg transition shadow-md bg-[#0047fb] hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        onClick={handlePostTask}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                Posting...
                                            </>
                                        ) : 'Get quotes'}
                                    </button>
                                )}
                            </div>
                        </div>

                    </form>
                </main>
            </div>
        </div>
    );
};

export default PostTask;
