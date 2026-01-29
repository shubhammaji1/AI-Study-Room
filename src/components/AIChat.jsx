import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AIChat = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const API_URL = "https://ai-study-room.onrender.com/api";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const askAI = async (inputQuery) => {
    const query = inputQuery || question;
    if (!query.trim()) return;

    // Add User Message
    const newMessages = [...messages, { type: "user", text: query }];
    setMessages(newMessages);
    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/ask-ai`, { question: query });
      
      // Add AI Message
      setMessages([...newMessages, { type: "ai", text: res.data.answer }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages([...newMessages, { type: "ai", text: "⚠️ Server error. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/60 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">AI Tutor</h2>
            <p className="text-xs text-indigo-300">Always here to help</p>
          </div>
        </div>
        
        {messages.length > 0 && (
          <button 
            onClick={() => setMessages([])}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
          >
            <span className="hidden sm:inline">Clear Chat</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* --- CHAT BODY --- */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        
        {/* WELCOME SCREEN */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-100">
            <div className="mb-6 p-4 bg-white/5 rounded-full ring-1 ring-white/10 animate-pulse">
              <span className="text-5xl">👋</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">How can I help you learn?</h3>
            <p className="text-slate-400 max-w-sm mb-8">
              Select a topic below or type your own question.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-xl">
              {[
                "Explain Quantum Physics simply",
                "Create a 3-day history study plan",
                "Summarize the laws of motion",
                "How do I stay focused?"
              ].map((text, i) => (
                <button 
                  key={i}
                  onClick={() => askAI(text)}
                  className="text-left px-5 py-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all duration-300 group shadow-sm hover:shadow-indigo-500/10"
                >
                  <span className="text-sm text-slate-300 group-hover:text-indigo-300 transition-colors">{text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGES */}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            
            {/* AI Avatar */}
            {msg.type === "ai" && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0 border border-indigo-500/30">
                    🤖
                </div>
            )}

            <div 
              className={`max-w-[85%] rounded-2xl p-4 text-sm md:text-base leading-7 shadow-lg ${
                msg.type === "user" 
                  ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/20" 
                  : "bg-slate-800/80 text-slate-200 border border-white/5 rounded-tl-none w-full"
              }`}
            >
              {msg.type === "user" ? (
                // Simple text for user
                msg.text
              ) : (
                // RICH TEXT FORMATTING FOR AI RESPONSES
                // FIX: Wrapped ReactMarkdown in a DIV to handle the styles
                <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-slate-950/50 prose-pre:border prose-pre:border-white/10">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            // Style Headings
                            h1: ({node, ...props}) => <h1 className="text-xl font-bold text-white mt-4 mb-2 border-b border-white/10 pb-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-lg font-semibold text-indigo-300 mt-4 mb-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-base font-semibold text-white mt-3 mb-1" {...props} />,
                            
                            // Style Lists
                            ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 text-slate-300 my-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1 text-slate-300 my-2" {...props} />,
                            
                            // Style Code Blocks
                            code: ({node, inline, className, children, ...props}) => {
                                return inline ? (
                                    <code className="bg-slate-700/50 text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
                                ) : (
                                    <div className="relative my-4 group">
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Code</div>
                                        </div>
                                        <code className="block bg-slate-950/60 border border-white/10 p-4 rounded-xl text-xs md:text-sm font-mono text-slate-300 overflow-x-auto" {...props}>
                                            {children}
                                        </code>
                                    </div>
                                )
                            },
                            
                            // Style Links
                            a: ({node, ...props}) => <a className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2" target="_blank" rel="noopener noreferrer" {...props} />,
                            
                            // Style Blockquotes
                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-slate-400 my-4 bg-indigo-500/5 py-2 rounded-r-lg" {...props} />,
                            
                            // Style Tables
                            table: ({node, ...props}) => <div className="overflow-x-auto my-4 border border-white/10 rounded-lg"><table className="min-w-full divide-y divide-white/10" {...props} /></div>,
                            th: ({node, ...props}) => <th className="bg-slate-900/80 px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider" {...props} />,
                            td: ({node, ...props}) => <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-300 border-t border-white/5" {...props} />,
                        }}
                    >
                        {msg.text}
                    </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="flex justify-start">
             <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center mr-3 mt-1 border border-indigo-500/30">🤖</div>
            <div className="bg-slate-800/80 px-4 py-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-2 items-center shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Thinking</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-white/5">
        <form 
          onSubmit={(e) => { e.preventDefault(); askAI(); }} 
          className="relative flex items-center gap-2 max-w-4xl mx-auto"
        >
          <input
            type="text"
            placeholder="Ask anything..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
            className="w-full bg-slate-950/50 text-white placeholder-slate-500 pl-5 pr-14 py-4 rounded-xl border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;