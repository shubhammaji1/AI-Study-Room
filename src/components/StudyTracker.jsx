import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast"; // 1. Import Toast
import StudyContext from "./StudyContext"; 

const StudyTracker = ({ userId }) => {
  const { sessionTime, isStudying, startSession, stopSession } = useContext(StudyContext);
  const [studyLogs, setStudyLogs] = useState([]);
  const [streak, setStreak] = useState(0);

  const API_URL = "https://ai-study-room.onrender.com/api"; 

  useEffect(() => {
    if (userId) fetchStudyLogs();
  }, [userId]);

  const fetchStudyLogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/study-logs/${userId}`);
      setStudyLogs(response.data.logs);
      setStreak(response.data.streak);
    } catch (error) {
      console.error("❌ Error fetching logs:", error);
    }
  };

  // 2. New Handler: Handles the actual saving logic
  const handleConfirmStop = async (tId) => {
    toast.dismiss(tId); // Dismiss the confirmation toast
    const loadingToast = toast.loading("Saving progress...");

    try {
      // Capture time BEFORE stopping the session
      const finalDuration = sessionTime;

      // Save to Backend
      await axios.post(`${API_URL}/study-log`, { 
        userId, 
        duration: finalDuration 
      });

      // Update UI
      fetchStudyLogs();
      stopSession(); // Stop local timer only after success
      
      toast.success("Session saved successfully!", { id: loadingToast });
    } catch (error) {
      console.error("❌ Error saving:", error);
      toast.error("Failed to save session. Please try again.", { id: loadingToast });
    }
  };

  // 3. Trigger Toast Confirmation instead of window.confirm
  const triggerStopConfirmation = () => {
    toast((t) => (
      <div className="flex flex-col gap-2 items-center">
        <p className="font-semibold text-slate-800">End session and save?</p>
        <div className="flex gap-2">
          <button 
            onClick={() => handleConfirmStop(t.id)}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
          >
            Yes, Save
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-slate-200 text-slate-700 text-sm rounded hover:bg-slate-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      style: {
        border: '1px solid #E2E8F0',
        padding: '16px',
        color: '#1E293B',
      },
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  return (
    <div className="text-center w-full max-w-4xl mx-auto px-2">
      {/* Toast Container */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* --- Header Section (Responsive Stack) --- */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-6 md:mb-10 border-b border-slate-800 pb-4 gap-4 md:gap-0">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Focus Timer</h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Track your deep work sessions</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="w-full md:w-auto px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-sm font-semibold flex justify-center items-center gap-2">
            🔥 {streak} Day Streak
          </div>
          <Link to="/study-history" className="text-sm text-slate-400 hover:text-white underline decoration-slate-600 underline-offset-4 transition-colors">
            View History
          </Link>
        </div>
      </div>

      {/* --- Timer Display (Responsive Text Size) --- */}
      <div className="relative mb-8 md:mb-12 group">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-indigo-500 blur-[60px] md:blur-[80px] opacity-10 md:opacity-20 rounded-full group-hover:opacity-30 transition-opacity duration-700"></div>
        
        {/* The Time */}
        <div className="relative z-10 font-mono text-6xl sm:text-7xl md:text-9xl font-thin tracking-tighter text-white tabular-nums drop-shadow-2xl transition-all duration-300">
          {formatTime(sessionTime)}
        </div>
        
        <div className="text-slate-500 font-medium tracking-widest uppercase text-[10px] md:text-xs mt-2">
           {sessionTime < 60 ? "Seconds" : "Minutes"}
        </div>
      </div>

      {/* --- Control Buttons --- */}
      <div className="flex justify-center mb-8 md:mb-12">
        {isStudying ? (
          <button 
            onClick={triggerStopConfirmation} // Calls the Toast trigger
            className="group relative w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl md:rounded-full transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.4)] active:scale-95"
          >
            <span className="relative flex items-center justify-center gap-3 font-bold text-base md:text-lg">
              <span className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-red-500 animate-pulse"/> Stop Session
            </span>
          </button>
        ) : (
          <button 
            onClick={() => {
              startSession();
              toast.success("Focus mode started!");
            }}
            className="group relative w-full sm:w-auto px-10 py-4 md:px-12 md:py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl md:rounded-full transition-all duration-300 shadow-xl hover:shadow-[0_0_40px_-5px_rgba(99,102,241,0.5)] transform hover:-translate-y-1 active:scale-95"
          >
            <span className="relative flex items-center justify-center gap-3 font-bold text-base md:text-lg tracking-wide">
              ▶ Start Focusing
            </span>
          </button>
        )}
      </div>

      {/* --- Recent Activity Mini-List --- */}
      <div className="max-w-md mx-auto">
        <h3 className="text-left text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 md:mb-4">Recent Sessions</h3>
        <div className="space-y-2">
          {studyLogs.slice(0, 3).map((log, index) => (
            <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
              <span className="text-slate-300 text-xs md:text-sm">{log.date}</span>
              <span className="font-mono text-indigo-300 text-xs md:text-sm">{Math.floor(log.duration / 60)}m {log.duration % 60}s</span>
            </div>
          ))}
          {studyLogs.length === 0 && (
            <div className="text-slate-600 text-xs md:text-sm italic py-4">No recent sessions recorded.</div>
          )}
        </div>
      </div>

    </div>
  );
};

export default StudyTracker;