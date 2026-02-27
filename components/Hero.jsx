"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRightCircle, 
  Check, 
  CreditCard, 
  ChevronRight, 
  MessageCircle,
  BarChart,
  Globe,
  Shield,
  Zap,
  Mic,
  Volume2,
  Sparkles,
  TrendingUp,
  Landmark
} from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeMessage, setActiveMessage] = useState(0);
  
  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setActiveMessage((prev) => (prev < 2 ? prev + 1 : prev));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    "AI-driven loan matching engines",
    "Real-time cross-bank rate comparison",
    "Zero-trust secure data handling",
    "Instant eligibility verification",
  ];

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-20 pb-16 overflow-hidden bg-[#030303]">
      {/* 
        ========================================
        BACKGROUND ANIMATIONS & GRID
        ========================================
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/20 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/20 blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[30vw] rounded-full bg-emerald-600/10 blur-[120px]"
        />
        
        {/* Tech Grid Pattern */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)]"
          style={{ backgroundSize: '40px 40px', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)' }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 max-w-[1400px] mx-auto">
          
          {/* 
            ========================================
            LEFT CONTENT COLUMN
            ========================================
          */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left pt-10 lg:pt-0"
          >
            {/* Top Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 mx-auto lg:mx-0 mb-6 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md w-max"
            >
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 tracking-wider uppercase">
                Next-Gen Financial Intelligence
              </span>
            </motion.div>
            
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1]">
              <span className="text-white">Loans meet </span>
              <br className="hidden lg:block" />
              <span className="relative inline-block">
                <span className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-30"></span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
                  Artificial Intelligence
                </span>
              </span>
            </h1>
            
            {/* Subtext */}
            <p className="text-gray-400 text-lg sm:text-xl mb-8 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Experience the future of borrowing. Our multilingual AI analyzes millions of data points across Indian banks to secure your perfect rate in seconds.
            </p>
            
            {/* Feature Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto lg:mx-0">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                  className="flex items-center space-x-3 text-left"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-300 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
              <Button className="h-14 px-8 bg-white text-black hover:bg-gray-200 rounded-full font-semibold text-base transition-all duration-300 hover:scale-[1.02] shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                Start Analysis <ArrowRightCircle className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="h-14 px-8 border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-white rounded-full font-semibold text-base backdrop-blur-md transition-all duration-300">
                Explore Rates
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="mt-12 flex items-center justify-center lg:justify-start space-x-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-black overflow-hidden flex items-center justify-center relative">
                     <span className="text-[10px] text-gray-400 absolute">USR</span>
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex text-yellow-400 text-xs">★★★★★</div>
                <span className="text-gray-400 font-medium">Trusted by <span className="text-white">50,000+</span> Indians</span>
              </div>
            </div>
          </motion.div>
          
          {/* 
            ========================================
            RIGHT INTERFACE COLUMN (GLASSMORPHIC UI)
            ========================================
          */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 40 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-1/2 max-w-2xl relative"
          >
            {/* Decorative Elements around UI */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-transparent rounded-[2.5rem] blur-xl opacity-50"></div>
            
            {/* Floating Rate Card */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 sm:-left-12 top-20 z-30 bg-gray-900/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center space-x-4 hidden md:flex"
            >
              <div className="h-10 w-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium tracking-wide">Lowest Current Rate</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-white">8.50%</span>
                  <span className="text-xs text-emerald-400">Fixed</span>
                </div>
              </div>
            </motion.div>

            {/* Main Chat Interface */}
            <div className="relative bg-[#0A0A0B]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[550px]">
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-inner">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#0A0A0B] rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">Sage AI</h3>
                    <p className="text-xs text-blue-400 font-medium">Online • Processing Data</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-300 font-mono tracking-wider">
                    SARVAM_ENG
                  </span>
                </div>
              </div>
              
              {/* Chat Body */}
              <div className="flex-1 p-6 overflow-y-auto scrollbar-none flex flex-col space-y-6 relative">
                
                {/* Initial Assistant Message */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 border border-white/5">
                    <Zap className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl rounded-tl-sm p-4 text-sm text-gray-200 max-w-[85%] shadow-md">
                    <p>Namaste! I'm Sage, your AI financial advisor. Are you looking for a personal, home, or business loan today?</p>
                  </div>
                </div>

                {/* User Message */}
                <AnimatePresence>
                  {activeMessage >= 1 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="flex items-end justify-end space-x-3"
                    >
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl rounded-tr-sm p-4 text-sm text-white max-w-[85%] shadow-lg shadow-blue-500/20">
                        <p>I need a ₹40 Lakh home loan. What are the best rates?</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Processing State */}
                <AnimatePresence>
                  {activeMessage === 1 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-3 text-xs text-gray-500"
                    >
                      <div className="w-8 h-8 flex justify-center items-center">
                         <div className="flex space-x-1">
                           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                         </div>
                      </div>
                      <span>Analyzing 15+ banks in real-time...</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Rich Response with UI Cards */}
                <AnimatePresence>
                  {activeMessage >= 2 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", bounce: 0.4 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 border border-white/5">
                        <Zap className="h-4 w-4 text-purple-400" />
                      </div>
                      <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl rounded-tl-sm p-4 text-sm text-gray-200 w-full shadow-md">
                        <p className="mb-4 text-gray-300">Here are the top matches for ₹40 Lakhs based on your profile:</p>
                        
                        {/* Interactive Rate Cards within Chat */}
                        <div className="space-y-3">
                          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-emerald-500/30 p-3.5 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer group relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-emerald-500/20 px-2 py-1 rounded-bl-lg text-[10px] text-emerald-400 font-bold uppercase tracking-wider group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                              Top Match
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] font-bold text-blue-900">SBI</div>
                                <span className="font-semibold text-white">State Bank</span>
                              </div>
                              <span className="text-lg font-bold text-emerald-400">8.50%</span>
                            </div>
                            <div className="flex space-x-4 text-xs text-gray-400">
                              <span>EMI: ₹34,712</span>
                              <span>Zero Proc. Fee</span>
                            </div>
                          </div>

                          <div className="bg-gray-800 border border-gray-700 p-3.5 rounded-xl hover:border-blue-500/50 transition-colors cursor-pointer">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">HDF</div>
                                <span className="font-semibold text-white">HDFC Bank</span>
                              </div>
                              <span className="text-lg font-bold text-blue-400">8.55%</span>
                            </div>
                            <div className="flex space-x-4 text-xs text-gray-400">
                              <span>EMI: ₹34,845</span>
                              <span>₹2,500 Fee</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex space-x-2">
                          <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 text-xs font-semibold text-white transition-colors">
                            Compare Details
                          </button>
                          <button className="flex-1 bg-blue-600 hover:bg-blue-500 rounded-lg py-2 text-xs font-semibold text-white transition-colors shadow-lg shadow-blue-500/20">
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
              
              {/* Input Area */}
              <div className="p-4 bg-white/[0.02] border-t border-white/5 backdrop-blur-md">
                <div className="relative flex items-center">
                  <button className="absolute left-3 text-gray-500 hover:text-white transition-colors">
                    <Mic className="h-5 w-5" />
                  </button>
                  <input 
                    type="text" 
                    placeholder="Ask about rates, eligibility, or terms..." 
                    className="w-full bg-[#1C1C1E] border border-white/10 rounded-full py-3 pl-11 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                    readOnly
                  />
                  <button className="absolute right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-blue-500 transition-colors">
                    <ArrowRightCircle className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex justify-center space-x-6 mt-3 text-[10px] text-gray-500 font-medium">
                  <span className="flex items-center"><Shield className="h-3 w-3 mr-1" /> 256-bit Secure</span>
                  <span className="flex items-center"><Globe className="h-3 w-3 mr-1" /> 10+ Languages</span>
                </div>
              </div>
            </div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;