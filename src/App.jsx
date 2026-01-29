import './App.css'
import Dashboard from './components/Dashboard'
import BookWidget from './components/BookModel' 
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";

function App() {

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden scroll-smooth">
      
      <main className="relative z-10">
        
        {/* --- STATE 1: LANDING PAGE (Signed Out) --- */}
        <SignedOut>
          
          {/* --- BACKGROUND EFFECTS --- */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            {/* Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
          </div>

          {/* --- 1. FLOATING NAVIGATION --- */}
          <motion.nav 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50"
          >
            <div className="flex justify-between items-center px-6 py-3 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-2xl shadow-indigo-500/10">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">AI</div>
                <span className="text-lg font-bold tracking-tight text-white">StudyRoom</span>
              </div>
              
              <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
                <a href="#features" className="hover:text-white transition-colors">Catalog</a>
                <a href="#how-it-works" className="hover:text-white transition-colors">Guide</a>
                {/* <a href="#pricing" className="hover:text-white transition-colors">Pricing</a> */}
              </div>

              <SignInButton mode="modal">
                <button className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]">
                  Login
                </button>
              </SignInButton>
            </div>
          </motion.nav>
         {/* --- 2. HERO SECTION --- */}
          <section className="relative pt-16 pb-20 md:pt-20 md:pb-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center z-10 min-h-[90vh]">
            
            {/* LEFT SIDE: Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1 relative z-20">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.5 }} 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-6 mx-auto lg:mx-0"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Immersive Study Architecture
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.1 }} 
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[1.1]"
              >
                Master Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
                  Curriculum
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.2 }} 
                className="text-lg md:text-xl text-slate-400 max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0"
              >
                Stop skimming the surface. Enter your private <span className="text-indigo-300">Deep Work Sanctuary</span> and let AI guide you from blank page to complete mastery.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.3 }} 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                 <SignInButton mode="modal">
                   <button className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-all transform hover:-translate-y-1">
                     Enter Library
                   </button>
                 </SignInButton>
                 <button className="px-8 py-4 text-lg font-bold text-white bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all backdrop-blur-sm">
                   View Guide
                 </button>
              </motion.div>
            </div>

            {/* RIGHT SIDE: 3D Book Model */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative h-[400px] md:h-[600px] w-full order-1 lg:order-2 flex items-center justify-center"
            >
              {/* Glow behind the book */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none"></div>
              
              {/* The 3D Component */}
              <div className="w-full h-full scale-110">
                 <BookWidget />
              </div>
            </motion.div>

          </section>
         {/* --- 3. FEATURES SECTION (Redesigned for Book Theme) --- */}
          <section id="features" className="py-32 relative z-10">
            {/* Subtle background glow for section */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full max-h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6">
              
              <motion.div 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                variants={fadeInUp} 
                className="text-center mb-20"
              >
                <div className="inline-block mb-4 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-mono uppercase tracking-widest">
                  Study Architecture
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                  Inside the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Cover</span>
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                  Advanced tools designed to deepen comprehension and accelerate your mastery of the material.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { 
                    id: "01",
                    icon: "⏳", 
                    title: "Deep Focus Timer", 
                    desc: "Immersive interval tracking with private webcam accountability. Keeps you locked into the text until the chapter ends.", 
                    color: "from-amber-400 to-orange-500",
                    shadow: "shadow-amber-500/20"
                  },
                  { 
                    id: "02",
                    icon: "🤖", 
                    title: "AI Librarian", 
                    desc: "Your personal scholar. Summarize heavy chapters, clarify complex footnotes, and generate quizzes instantly.", 
                    color: "from-indigo-400 to-cyan-400",
                    shadow: "shadow-indigo-500/20"
                  },
                  { 
                    id: "03",
                    icon: "📜", 
                    title: "Syllabus Architect", 
                    desc: "Structure your learning path. Generates a custom 7-day curriculum to master any volume of work.", 
                    color: "from-pink-400 to-rose-500",
                    shadow: "shadow-pink-500/20"
                  }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative h-full"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    
                    {/* Card Content */}
                    <div className="relative h-full bg-[#0F121C] border border-white/5 rounded-3xl p-8 overflow-hidden hover:bg-[#131620] transition-colors duration-300">
                      
                      {/* Top Row: ID & Status Light */}
                      <div className="flex justify-between items-start mb-8">
                        <span className="font-mono text-slate-600 text-sm tracking-widest opacity-50">/{feature.id}</span>
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color} shadow-[0_0_10px_currentColor] animate-pulse`}></div>
                      </div>

                      {/* Icon Container (Engraved Look) */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-10 flex items-center justify-center text-4xl mb-6 shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform duration-300`}>
                        <div className="bg-[#0F121C] w-[90%] h-[90%] rounded-xl flex items-center justify-center">
                          {feature.icon}
                        </div>
                      </div>

                      {/* Text */}
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-200 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed text-sm">
                        {feature.desc}
                      </p>

                      {/* Bottom Shine Line */}
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          {/* --- 4. HOW IT WORKS --- */}
         <section id="how-it-works" className="py-24 relative z-10">
            <div className="max-w-5xl mx-auto px-4">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
                 <h2 className="text-3xl md:text-5xl font-bold mb-4">The Learning Arc</h2>
                 <p className="text-slate-400">From blank page to mastery in three chapters.</p>
              </motion.div>
              
              <div className="grid md:grid-cols-3 gap-12 text-center relative">
                 {/* Connecting Line (Desktop) - Styled like a bookmark ribbon or timeline */}
                 <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

                 {[
                   { step: "I", title: "The Outline", desc: "Input your subject. The AI Librarian structures your personalized table of contents." },
                   { step: "II", title: "Deep Focus", desc: "Enter the Reading Room. The camera acts as your proctor to ensure deep immersion." },
                   { step: "III", title: "The Index", desc: "Review your study history logs and solidify key concepts with AI summaries." }
                 ].map((item, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.2 }}
                     className="relative z-10"
                   >
                     {/* Design Update: Serif font and Roman Numerals for a 'Book Chapter' look */}
                     <div className="w-24 h-24 mx-auto bg-slate-900 border-4 border-indigo-600 rounded-full flex items-center justify-center text-3xl font-serif font-bold text-white mb-6 shadow-lg shadow-indigo-500/20">
                       {item.step}
                     </div>
                     <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                     <p className="text-slate-400">{item.desc}</p>
                   </motion.div>
                 ))}
              </div>
            </div>
          </section>

       

          {/* --- 6. FOOTER --- */}
          <footer className="py-12 border-t border-white/10 text-center relative z-10 bg-[#020617]">
            <p className="text-slate-600 text-sm">© 2026 StudyRoom AI. Performance Learning.</p>
          </footer>

        </SignedOut>

        {/* --- STATE 2: DASHBOARD (Signed In) --- */}
        <SignedIn>
          <Dashboard />
        </SignedIn>

      </main>
    </div>
  )
}

export default App