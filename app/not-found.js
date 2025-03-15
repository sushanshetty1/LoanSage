"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Home, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen pt-32 pb-16 overflow-hidden bg-black">
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
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Error Code */}
          <div className="flex justify-center items-center mb-6">
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-800/30 rounded-full">
              <span className="text-xs font-medium text-purple-300 tracking-wider flex items-center">
                <AlertTriangle className="h-3 w-3 mr-2" />
                PAGE NOT FOUND
              </span>
            </div>
          </div>
          
          {/* Main error display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mb-10"
          >
            <h1 className="text-9xl font-bold mb-4 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                404
              </span>
            </h1>
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-purple-500/0 my-8"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Page not found
            </h2>
            <p className="text-gray-300 text-lg max-w-lg mx-auto mb-8">
              We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
            </p>
          </motion.div>
          
          {/* Interactive elements */}
          <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl p-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mb-6"
            >
              <p className="text-gray-400 mb-2">Try searching for what you need:</p>
              
              <div className="flex w-full max-w-md mx-auto">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search our site..."
                    className="w-full py-2 px-4 pr-10 bg-gray-800/50 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-gray-200"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-2 px-4 rounded-r-lg transition-colors">
                  Search
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link href="/" className="flex items-center px-5 py-2 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-purple-500/30 rounded-lg text-white hover:bg-gray-800 transition-colors">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
              <Link href="javascript:history.back()" className="flex items-center px-5 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Link>
            </motion.div>
          </div>
          
          {/* Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="relative w-64 h-64 mx-auto my-12"
          >
            {/* Circular rotating elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-full h-full"
            >
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2"></div>
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2"></div>
              <div className="absolute left-0 top-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-y-1/2"></div>
              <div className="absolute right-0 top-1/2 w-2 h-2 bg-purple-500 rounded-full transform -translate-y-1/2"></div>
            </motion.div>
            
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-full h-full"
            >
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-purple-400 rounded-full"></div>
              <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-purple-400 rounded-full"></div>
            </motion.div>
            
            {/* Central error element */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}