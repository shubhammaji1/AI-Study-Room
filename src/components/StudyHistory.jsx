import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// ❌ REMOVED: import "./StudyHistory.css";

const StudyHistory = ({ userId }) => {
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://ai-study-room.onrender.com/api";

  useEffect(() => {
    if (userId) {
      fetchStudyHistory();
    }
  }, [userId]);

  const fetchStudyHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/study-history/${userId}`);
      setHistoryLogs(response.data.history);
    } catch (error) {
      console.error("❌ Error fetching history:", error);
    }
    setLoading(false);
  };

  const handleDeleteHistory = async () => {
    if (!window.confirm("Are you sure you want to permanently delete all history?")) return;

    try {
      await axios.delete(`${API_URL}/study-history/${userId}`);
      setHistoryLogs([]); 
    } catch (error) {
      console.error("❌ Error deleting history:", error);
    }
  };

  // Helper to make time look nice (e.g. 125s -> 2m 5s)
  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">📜</span> Study History
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Track your progress and past sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-sm font-medium border border-white/5"
          >
            ← Back to Tracker
          </Link>
          
          {historyLogs.length > 0 && (
            <button 
              onClick={handleDeleteHistory}
              className="px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all text-sm font-medium flex items-center gap-2"
            >
              <span>🗑</span>
              <span className="hidden sm:inline">Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      {loading ? (
        // Loading Skeletons
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="h-24 bg-slate-800/50 rounded-2xl border border-white/5"></div>
           ))}
        </div>
      ) : historyLogs.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
           <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/10">
             <span className="text-4xl">🕰️</span>
           </div>
           <h3 className="text-xl font-semibold text-white">No history yet</h3>
           <p className="text-slate-400 mt-2 max-w-xs">
             Start a study session in the Tracker to see your logs appear here.
           </p>
           <Link to="/" className="mt-6 text-indigo-400 hover:text-indigo-300 hover:underline">
             Start Studying Now &rarr;
           </Link>
        </div>
      ) : (
        // History Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {historyLogs.map((log, index) => (
            <div 
              key={index}
              className="group relative bg-slate-900/40 backdrop-blur-md border border-white/10 hover:border-indigo-500/30 rounded-2xl p-5 transition-all hover:bg-slate-800/40 hover:-translate-y-1 shadow-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold border border-indigo-500/20">
                    {index + 1}
                  </div>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Session</span>
                </div>
                <span className="text-xs text-slate-400 bg-slate-950/30 px-2 py-1 rounded-md border border-white/5">
                  {log.date}
                </span>
              </div>
              
              <div className="mt-3">
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Duration</p>
                <p className="text-2xl font-mono text-white font-light group-hover:text-indigo-300 transition-colors">
                  {formatDuration(log.duration)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default StudyHistory;