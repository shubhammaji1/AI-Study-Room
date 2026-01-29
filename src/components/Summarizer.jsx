import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Summarizer = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ original: 0, summary: 0, reduction: 0 });

  const API_URL = "https://ai-study-room.onrender.com/api"; 

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setSummary(""); 

    try {
      const response = await axios.post(`${API_URL}/summarize`, { text });
      const summaryText = response.data.summary;
      
      // Calculate Stats
      const originalWords = text.trim().split(/\s+/).length;
      const summaryWords = summaryText.trim().split(/\s+/).length;
      const reduction = Math.max(0, Math.round(((originalWords - summaryWords) / originalWords) * 100));
      
      setStats({ original: originalWords, summary: summaryWords, reduction });
      setSummary(summaryText);
    } catch (error) {
      console.error("Error summarizing text:", error);
      setSummary("⚠️ Failed to generate summary. Please check your connection.");
    }

    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* --- HEADER --- */}
      <div className="text-center md:text-left border-b border-white/10 pb-6">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-3">
          <span className="text-4xl">📝</span> 
          <span>Smart Abstract</span>
        </h2>
        <p className="text-slate-400 mt-2 text-sm max-w-lg">
           Paste your dense articles or lecture notes below. The AI will distill them into clear, actionable insights.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* --- LEFT: INPUT AREA --- */}
        <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Source Material</label>
                {text && (
                    <button onClick={() => setText("")} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                        Clear
                    </button>
                )}
            </div>

            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-1 border border-white/10">
                <textarea
                    placeholder="Paste text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={loading}
                    className="w-full h-80 bg-transparent text-slate-200 placeholder-slate-600 p-6 rounded-xl resize-none focus:outline-none focus:ring-0 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent font-mono"
                />
                </div>
            </div>

            <button 
                onClick={handleSummarize} 
                disabled={loading || !text.trim()}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Distilling...</span>
                    </>
                ) : (
                    <>
                    <span>⚡ Generate Summary</span>
                    </>
                )}
            </button>
        </div>

        {/* --- RIGHT: OUTPUT AREA --- */}
        <div className="relative">
            {/* Placeholder State */}
            {!summary && !loading && (
                <div className="h-full border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-slate-600 p-8 text-center bg-slate-900/20">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-2xl opacity-50">📄</div>
                    <p className="text-sm">Summary will appear here.</p>
                </div>
            )}

            {(summary || loading) && (
                <div className="animate-fade-in-up h-full flex flex-col">
                    <div className="flex justify-between items-center px-1 mb-4">
                        <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Key Insights</label>
                        {!loading && (
                            <div className="flex gap-3">
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-white/5">
                                    {stats.original} words → {stats.summary} words
                                </span>
                                <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20 font-bold">
                                    {stats.reduction}% Less Reading
                                </span>
                            </div>
                        )}
                    </div>

                    <div className={`relative flex-1 bg-slate-950/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden ${loading ? "min-h-[300px]" : ""}`}>
                        {/* Decorative Gradient */}
                        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

                        {loading ? (
                            <div className="space-y-4 animate-pulse mt-4">
                                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-800 rounded w-full"></div>
                                <div className="h-4 bg-slate-800 rounded w-full"></div>
                                <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                                <div className="h-20 bg-slate-800/50 rounded w-full mt-6"></div>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full">
                                <div className="prose prose-invert prose-sm max-w-none flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pr-2">
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({node, ...props}) => <h3 className="text-lg font-bold text-white mb-2" {...props} />,
                                            h2: ({node, ...props}) => <h4 className="text-base font-bold text-indigo-300 mb-1 mt-3" {...props} />,
                                            ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 text-slate-300 mb-3" {...props} />,
                                            li: ({node, ...props}) => <li className="marker:text-indigo-500" {...props} />,
                                            p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed mb-3" {...props} />,
                                            strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />
                                        }}
                                    >
                                        {summary}
                                    </ReactMarkdown>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                                    <button 
                                        onClick={handleCopy}
                                        className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
                                    >
                                        {copied ? <span className="text-green-400">Copied ✓</span> : <span>Copy Result</span>}
                                    </button>
                                </div>
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

export default Summarizer;