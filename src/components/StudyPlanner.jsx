import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const StudyPlanner = () => {
  const [topic, setTopic] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://ai-study-room.onrender.com/api"; 

  const generatePlan = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setPlan(""); 

    try {
      const response = await axios.post(`${API_URL}/study-plan`, { topic });
      setPlan(response.data.plan);
    } catch (error) {
      console.error("Error generating plan:", error);
      setPlan("⚠️ Failed to connect to the Library. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* --- HEADER --- */}
      <div className="text-center md:text-left border-b border-white/10 pb-6">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-3">
          <span className="text-4xl">📜</span> 
          <span>Syllabus Architect</span>
        </h2>
        <p className="text-slate-400 mt-2 text-sm max-w-lg">
           Define your subject. The AI will structure a comprehensive 7-day mastery curriculum for you.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: INPUT PANEL --- */}
        <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                    Course Subject
                </label>
                
                <input
                    type="text"
                    placeholder="e.g. Calculus, Art History..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={loading}
                    className="w-full bg-slate-950 text-white placeholder-slate-600 px-4 py-3 rounded-xl border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all mb-4"
                />

                <button
                    onClick={generatePlan}
                    disabled={loading || !topic.trim()}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Drafting...</span>
                        </>
                    ) : (
                        <>
                        <span>⚡ Design Syllabus</span>
                        </>
                    )}
                </button>
            </div>

            {/* Tips Card */}
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6">
                <h4 className="text-indigo-300 font-bold text-sm mb-2">Pro Tip</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                    Be specific. Instead of "History", try "The French Revolution" for a deeper curriculum.
                </p>
            </div>
        </div>

        {/* --- RIGHT: OUTPUT PANEL --- */}
        <div className="lg:col-span-2">
            {!plan && !loading && (
                <div className="h-full min-h-[400px] border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-slate-600 p-8 text-center bg-slate-900/20">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-2xl opacity-50">📅</div>
                    <p className="text-sm">Your custom schedule will appear here.</p>
                </div>
            )}

            {(plan || loading) && (
                <div className="animate-fade-in-up">
                    <div className="flex justify-between items-center px-1 mb-3">
                        <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Curriculum Roadmap</label>
                    </div>

                    <div className="relative bg-slate-950/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden min-h-[400px]">
                        {/* Paper Texture Effect */}
                        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

                        {loading ? (
                             <div className="space-y-6 animate-pulse mt-2">
                                <div className="h-8 bg-slate-800 rounded w-1/2 mb-8"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-slate-800 rounded w-full"></div>
                                    <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                                    <div className="h-4 bg-slate-800 rounded w-4/6"></div>
                                </div>
                                <div className="space-y-3 pt-6 border-t border-white/5">
                                    <div className="h-4 bg-slate-800 rounded w-full"></div>
                                    <div className="h-4 bg-slate-800 rounded w-11/12"></div>
                                </div>
                             </div>
                        ) : (
                            <div className="prose prose-invert max-w-none">
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-white/10" {...props} />,
                                        h2: ({node, ...props}) => <h2 className="text-lg font-bold text-indigo-300 mt-8 mb-3 uppercase tracking-wide flex items-center gap-2" {...props} />,
                                        h3: ({node, ...props}) => <h3 className="text-base font-bold text-white mt-4 mb-2" {...props} />,
                                        ul: ({node, ...props}) => <ul className="list-none space-y-3 my-4 pl-0" {...props} />,
                                        li: ({node, ...props}) => (
                                            <li className="flex gap-3 text-slate-300 text-sm leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-white/5" {...props}>
                                                <span className="text-indigo-500 mt-1">•</span>
                                                <span>{props.children}</span>
                                            </li>
                                        ),
                                        strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />
                                    }}
                                >
                                    {plan}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;