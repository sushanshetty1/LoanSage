"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRightCircle,
  Check,
  CreditCard,
  MessageCircle,
  Globe,
  Shield,
  BarChart,
  Zap,
  Mic,
  Volume2,
} from "lucide-react";

const CreditScorePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    "Instant credit score check",
    "Detailed credit report analysis",
    "Multilingual support in 10 Indian languages",
    "Voice-enabled credit score insights",
    "Step-by-step guidance to improve your score",
  ];

  return (
    <div className="relative pt-32 pb-16 md:pb-24 overflow-hidden bg-black">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          initial={{ opacity: 0, x: -100, y: -100 }}
          animate={{ opacity: 0.3, x: 0, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, x: 100, y: 100 }}
          animate={{ opacity: 0.2, x: 0, y: 0 }}
          transition={{ duration: 1.5, delay: 0.7 }}
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl"
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Desktop Layout - Left content, Right interface */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full lg:w-1/2 lg:pr-8 text-center lg:text-left"
          >
            <div className="inline-block mb-3 px-3 py-1 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-800/30 rounded-full">
              <span className="text-xs font-medium text-purple-300 tracking-wider">
                10 INDIAN LANGUAGES SUPPORTED
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight"
            >
              <span className="text-white">Understand and Improve Your </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Credit Score
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-gray-300 text-lg mb-6 lg:max-w-lg"
            >
              Get instant access to your credit score, detailed analysis, and
              personalized tips to improve it — all in your preferred language.
            </motion.p>

            {/* Feature list - Left aligned on desktop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mb-8 space-y-3 max-w-md mx-auto lg:mx-0"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : 10,
                  }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-6 rounded-full flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/20 relative overflow-hidden group">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                  <CreditCard className="h-5 w-5 mr-2" />
                  <span>Check Your Credit Score</span>
                  <ArrowRightCircle className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column - Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="w-full lg:w-1/2 lg:max-w-xl"
          >
            {/* Chat window mockup */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isVisible ? 0 : 20, opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl shadow-purple-500/10 overflow-visible relative"
            >
              {/* Floating language badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                className="absolute -left-4 sm:-left-8 md:-left-10 top-16 p-2 sm:p-3 bg-gray-900/90 backdrop-blur-sm border border-purple-800/30 rounded-lg shadow-xl z-30"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <p className="text-xs text-green-400">Powered by Sarvam AI</p>
                </div>
              </motion.div>

              {/* Audio Feature Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="absolute -right-4 sm:-right-8 md:-right-10 top-16 p-2 sm:p-3 bg-gray-900/90 backdrop-blur-sm border border-purple-800/30 rounded-lg shadow-xl z-30"
              >
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-3 w-3 text-blue-400" />
                  <p className="text-xs text-blue-400">Voice Enabled</p>
                </div>
              </motion.div>

              {/* Chat header */}
              <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Sage</h3>
                  <p className="text-xs text-gray-300">
                    AI-Powered • Multilingual • Voice Support
                  </p>
                </div>
                <div className="ml-auto flex space-x-2">
                  {["🇮🇳", "हि", "বা", "ગુ", "கன்"].map((lang, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-white rounded-full px-2 py-1"
                    >
                      {lang}
                    </span>
                  ))}
                  <span className="text-xs bg-blue-600 rounded-full px-2 py-1">
                    +5
                  </span>
                </div>
              </div>

              {/* Chat content */}
              <div className="p-4 sm:p-5 h-64 sm:h-80 overflow-y-auto bg-gradient-to-b from-gray-900/50 to-black/80">
                {/* Bot welcome message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mb-5 max-w-[80%]"
                >
                  <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 border border-gray-700/50 shadow-sm">
                    <p className="text-gray-200">
                      नमस्ते! मैं आपका LoanSage सलाहकार हूं। आज मैं आपकी कैसे
                      मदद कर सकता हूं?
                    </p>
                    <p className="text-gray-200 mt-2">
                      Hello! I'm your Sage. How can I help you today?
                    </p>

                    {/* Audio playback option */}
                    <div className="mt-3 flex items-center space-x-2">
                      <button className="bg-gray-700/50 hover:bg-gray-700 rounded-full p-1.5 transition-colors">
                        <Volume2 className="h-3.5 w-3.5 text-blue-400" />
                      </button>
                      <div className="bg-gray-700/30 h-1 flex-grow rounded-full">
                        <div className="bg-blue-500/50 h-1 w-1/3 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span className="font-medium mr-2">Sage</span>
                    <span>•</span>
                    <span className="ml-2">Hindi & English</span>
                    <span className="ml-2">•</span>
                    <span className="ml-2">Just now</span>
                  </div>
                </motion.div>

                {/* User message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="mb-5 ml-auto max-w-[80%]"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl rounded-tr-none p-4 shadow-sm">
                    <p className="text-white">
                      Can you help me check my credit score?
                    </p>
                  </div>
                  <div className="flex items-center justify-end mt-2 text-xs text-gray-500">
                    <span className="mr-2">Just now</span>
                    <span>•</span>
                    <span className="ml-2 font-medium">You</span>
                  </div>
                </motion.div>

                {/* Bot response with credit score details */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="mb-5 max-w-[85%]"
                >
                  <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 border border-gray-700/50 shadow-sm">
                    <p className="text-gray-200 mb-3">
                      Your current credit score is <strong>750</strong>, which
                      is considered excellent! Here's a breakdown:
                    </p>

                    <div className="space-y-3">
                      <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50 hover:border-blue-500/50 transition-colors cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-blue-400 font-medium">
                              Payment History
                            </h4>
                            <p className="text-xs text-gray-300 mt-1">
                              100% on-time payments
                            </p>
                          </div>
                          <span className="text-emerald-400 font-bold">
                            Excellent
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-700/50 p-3 rounded-lg border border-blue-500/50 shadow-sm transition-colors cursor-pointer relative overflow-visible">
                        <div className="absolute -top-2 -right-2">
                          <div className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-md">
                            Improve
                          </div>
                        </div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-blue-400 font-medium">
                              Credit Utilization
                            </h4>
                            <p className="text-xs text-gray-300 mt-1">
                              Currently at 45%
                            </p>
                          </div>
                          <span className="text-yellow-400 font-bold">
                            Good
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 mt-3 text-sm">
                      Would you like tips to improve your score further?
                    </p>

                    {/* Audio playback option */}
                    <div className="mt-3 flex items-center space-x-2">
                      <button className="bg-gray-700/50 hover:bg-gray-700 rounded-full p-1.5 transition-colors">
                        <Volume2 className="h-3.5 w-3.5 text-blue-400" />
                      </button>
                      <div className="bg-gray-700/30 h-1 flex-grow rounded-full">
                        <div className="bg-blue-500/50 h-1 w-2/3 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span className="font-medium mr-2">Sage</span>
                    <span>•</span>
                    <span className="ml-2">English</span>
                    <span className="ml-2">•</span>
                    <span className="ml-2">Just now</span>
                  </div>
                </motion.div>
              </div>

              {/* Chat input */}
              <div className="border-t border-gray-800 p-3 sm:p-4">
                <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-3 sm:px-5 py-2 sm:py-3 flex items-center">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="bg-transparent text-white text-xs sm:text-sm flex-1 focus:outline-none"
                    disabled
                  />
                  <div className="flex space-x-1 sm:space-x-2 items-center">
                    <button className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">
                      <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <button className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">
                      <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <button className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-700/20">
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Technology stack section at bottom - Full width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.7, delay: 1.4 }}
          className="w-full max-w-6xl mx-auto pt-12 sm:pt-16"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl text-white mb-2">Powered By</h3>
            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Globe, name: "Sarvam AI", desc: "Multilingual Support" },
              { icon: Shield, name: "Zero-Trust", desc: "Secure Banking" },
              { icon: BarChart, name: "OpenBanking", desc: "Real-time Rates" },
              { icon: Zap, name: "Krutrim AI", desc: "Voice Technology" },
            ].map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + idx * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 hover:border-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/5"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-3 mx-auto">
                  <tech.icon className="h-5 w-5 text-purple-400" />
                </div>
                <h4 className="text-white font-medium text-center">
                  {tech.name}
                </h4>
                <p className="text-gray-400 text-xs text-center mt-1">
                  {tech.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreditScorePage;
