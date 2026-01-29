import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react"; // Import UserButton here
import AIChat from "./AIChat";
import StudyTracker from "./StudyTracker";
import DistractionTracker from "./DistractionTracker";
import Summarizer from "./Summarizer";
import StudyPlanner from "./StudyPlanner";
import StudyHistory from "./StudyHistory";
import { StudyProvider } from "./StudyContext";

// Icons
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const ChevronLeft = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>;

// Helper component to show current page title in header
const HeaderTitle = () => {
  const location = useLocation();
  const titles = {
    "/": "Study Tracker",
    "/ai-chat": "AI Tutor",
    "/summarizer": "Notes Summarizer",
    "/study-planner": "Study Planner",
    "/study-history": "History"
  };
  return <h1 className="text-lg font-bold text-white tracking-wide">{titles[location.pathname] || "Dashboard"}</h1>;
};

const Dashboard = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!isLoaded || !isSignedIn) {
    return <div className="h-screen flex items-center justify-center text-slate-500">Loading Workspace...</div>;
  }

  const navItems = [
    { to: "/", icon: "⏱️", label: "Tracker" },
    { to: "/ai-chat", icon: "🤖", label: "AI Tutor" },
    { to: "/summarizer", icon: "📝", label: "Summarizer" },
    { to: "/study-planner", icon: "📅", label: "Planner" },
    { to: "/study-history", icon: "📜", label: "History" },
  ];

  return (
    <Router>
      <StudyProvider>
        {/* Full Screen Container */}
        <div className="flex h-screen w-screen overflow-hidden bg-[#020617] relative">
          
          {/* =======================
              DESKTOP SIDEBAR 
             ======================= */}
          <aside 
            className={`hidden md:flex flex-col flex-shrink-0 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 transition-all duration-300 ease-in-out z-20 ${
              isSidebarOpen ? "w-72 p-5" : "w-20 p-3"
            }`}
          >
            {/* Sidebar Brand */}
            <div className={`flex items-center ${isSidebarOpen ? "justify-between" : "justify-center"} mb-8 h-10`}>
              {isSidebarOpen && (
                 <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">AI</div>
                   <div>
                     <h2 className="text-sm font-bold text-white tracking-wide">STUDY HUB</h2>
                     <p className="text-[10px] text-slate-400">Pro Workspace</p>
                   </div>
                 </div>
              )}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
              >
                {isSidebarOpen ? <ChevronLeft /> : <MenuIcon />}
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <NavLink 
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => 
                    `flex items-center gap-3 rounded-lg transition-all duration-200 ${
                      isSidebarOpen ? "px-4 py-3 text-sm font-medium" : "justify-center py-3 px-2"
                    } ${
                      isActive 
                        ? "bg-indigo-600/10 text-indigo-300 border border-indigo-500/20 shadow-[0_0_15px_-3px_rgba(79,70,229,0.2)]" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                    }`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && <span>{item.label}</span>}
                </NavLink>
              ))}
            </nav>

            {/* Camera Widget */}
            <div className={`mt-auto pt-6 border-t border-white/5 ${!isSidebarOpen && "hidden"}`}>
               <p className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-wider px-1">Focus Detector</p>
               <div className="rounded-xl overflow-hidden border border-white/10 bg-black shadow-inner relative h-36 w-full group">
                 <DistractionTracker /> 
               </div>
            </div>
          </aside>

          {/* =======================
              MAIN CONTENT AREA 
             ======================= */}
          <div className="flex-1 flex flex-col h-full relative">
            
            {/* --- FLOATING HEADER --- */}
            <header className="absolute top-4 left-4 right-4 md:left-8 md:right-8 h-16 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10 flex items-center justify-between px-6 z-50 shadow-2xl">
               {/* Left: Mobile Title or Breadcrumb */}
               <div className="flex items-center gap-4">
                 <div className="md:hidden h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">AI</div>
                 <HeaderTitle />
               </div>

               {/* Right: User Profile (Moved from App.jsx) */}
               <div className="flex items-center gap-4">
                 <div className="hidden sm:block text-right">
                   <p className="text-xs text-slate-400">Student</p>
                   <p className="text-sm font-bold text-white leading-none">{user.firstName}</p>
                 </div>
                 <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9 border-2 border-indigo-500/50"
                      }
                    }}
                 />
               </div>
            </header>

            {/* --- SCROLLABLE CONTENT --- */}
            <main className="flex-1 overflow-y-auto pt-24 pb-24 md:pb-8 px-4 md:px-8 scroll-smooth scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              <div className="max-w-6xl mx-auto min-h-full">
                {/* Mobile Camera (Visible only on small screens) */}
                <div className="md:hidden mb-6 p-4 bg-slate-900/60 rounded-2xl border border-white/10">
                   <div className="flex items-center justify-between mb-3">
                     <h3 className="text-sm font-bold text-slate-300">Focus Camera</h3>
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-[10px] text-red-300 font-mono">LIVE</span>
                     </div>
                   </div>
                   <div className="h-48 rounded-xl overflow-hidden bg-black border border-white/10 relative">
                     <DistractionTracker />
                   </div>
                </div>

                <Routes>
                  <Route path="/" element={<StudyTracker userId={user.id} />} />
                  <Route path="/ai-chat" element={<AIChat />} />
                  <Route path="/summarizer" element={<Summarizer />} />
                  <Route path="/study-planner" element={<StudyPlanner />} />
                  <Route path="/study-history" element={<StudyHistory userId={user.id} />} />
                </Routes>
              </div>
            </main>

          </div>

          {/* =======================
              MOBILE BOTTOM NAV 
             ======================= */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 px-6 py-3 flex justify-between items-center z-50 safe-area-bottom">
            {navItems.map((item) => (
              <NavLink 
                key={item.to}
                to={item.to}
                className={({ isActive }) => 
                  `flex flex-col items-center gap-1 transition-all duration-200 ${
                    isActive 
                      ? "text-indigo-400 scale-110" 
                      : "text-slate-500 hover:text-slate-300"
                  }`
                }
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

        </div>
      </StudyProvider>
    </Router>
  );
};

export default Dashboard;