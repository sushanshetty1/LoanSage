"use client"
import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Mic, 
  MessageCircle, 
  Globe, 
  SendHorizontal,
  Check,
  PauseCircle,
  PlayCircle,
  Sparkles,
  Languages,
  Headphones,
  Home
} from 'lucide-react';
import { db, auth } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const SageChat = () => {
  const [user, setUser] = useState(null);
  
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'नमस्ते! मैं आपका Sage सलाहकार हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
      translation: 'Hello! I\'m your Sage. How can I help you today?',
      language: 'Hindi & English',
      isPlaying: false,
      progressBar: 0
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  // Add new state for tracking continuous voice interaction
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  // Track if we're in listening mode or response mode
  const [voiceInteractionState, setVoiceInteractionState] = useState('idle'); // 'listening', 'processing', 'responding'
  const [recordingPulse, setRecordingPulse] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceOutput, setVoiceOutput] = useState('');
  const [voiceAmplitude, setVoiceAmplitude] = useState(0);
  const [orbAnimationFrame, setOrbAnimationFrame] = useState(0);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const initialRender = useRef(true);
  const voiceVisualizerRef = useRef(null);
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', flag: 'हि' },
    { code: 'bn', name: 'Bengali', flag: 'বा' },
    { code: 'gu', name: 'Gujarati', flag: 'ગु' },
    { code: 'kn', name: 'Kannada', flag: 'ಕ' },
    { code: 'ml', name: 'Malayalam', flag: 'മ' },
    { code: 'mr', name: 'Marathi', flag: 'म' },
    { code: 'pa', name: 'Punjabi', flag: 'ਪੰ' },
    { code: 'ta', name: 'Tamil', flag: 'த' },
    { code: 'te', name: 'Telugu', flag: 'తె' }
  ];

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          
          // Update current language from user data if available
          if (userData.lang) {
            setCurrentLanguage(userData.lang);
          }
          
          // Update welcome message with user's name
          if (userData.name) {
            setMessages([{
              sender: 'bot',
              text: `नमस्ते ${userData.name}! मैं आपका Sage सलाहकार हूं। आज मैं आपकी कैसे मदद कर सकता हूं?`,
              translation: `Hello ${userData.name}! I'm your Sage. How can I help you today?`,
              language: 'Hindi & English',
              isPlaying: false,
              progressBar: 0
            }]);
          }
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!initialRender.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    } else {
      initialRender.current = false;
    }
  }, [messages.length]);

  useEffect(() => {
    const intervals = messages.map((message, index) => {
      if (message.isPlaying) {
        return setInterval(() => {
          setMessages(prev => prev.map((m, i) => {
            if (i === index) {
              const newProgress = m.progressBar + 1;
              if (newProgress >= 100) {
                clearInterval(intervals[index]);
                return { ...m, isPlaying: false, progressBar: 0 };
              }
              return { ...m, progressBar: newProgress };
            }
            return m;
          }));
        }, 30);
      }
      return null;
    }).filter(Boolean);

    return () => intervals.forEach(interval => clearInterval(interval));
  }, [messages]);

  // Simulate voice amplitude changes when in voice active mode
  useEffect(() => {
    let animationFrameId;
    let lastUpdate = 0;
    let updateInterval = 50; // ms between updates

    if (isVoiceActive) {
      const simulateVoiceAmplitude = (timestamp) => {
        if (timestamp - lastUpdate > updateInterval) {
          // Generate different amplitudes based on the voice interaction state
          let newAmplitude;
          if (isRecording) {
            // Higher amplitude when recording/listening
            newAmplitude = 0.2 + Math.random() * 0.8;
          } else if (voiceInteractionState === 'processing') {
            // Medium amplitude when processing
            newAmplitude = 0.1 + Math.random() * 0.3;
          } else if (voiceInteractionState === 'responding') {
            // Rhythmic amplitude when responding
            newAmplitude = 0.3 + Math.sin(timestamp/200) * 0.4;
          } else {
            // Low idle amplitude
            newAmplitude = 0.05 + Math.random() * 0.15;
          }
          
          setVoiceAmplitude(newAmplitude);
          lastUpdate = timestamp;
          
          // Update orb animation frame
          setOrbAnimationFrame(prev => (prev + 1) % 5);
        }
        animationFrameId = requestAnimationFrame(simulateVoiceAmplitude);
      };
      
      animationFrameId = requestAnimationFrame(simulateVoiceAmplitude);
    } else {
      setVoiceAmplitude(0);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVoiceActive, isRecording, voiceInteractionState]);

  useEffect(() => {
    let interval;
    if (isRecording || voiceInteractionState === 'responding') {
      interval = setInterval(() => {
        setRecordingPulse(prev => !prev);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isRecording, voiceInteractionState]);

  const toggleAudio = (index) => {
    setMessages(messages.map((message, i) => {
      if (i === index) {
        return { ...message, isPlaying: !message.isPlaying, progressBar: message.isPlaying ? 0 : message.progressBar };
      } else {
        return { ...message, isPlaying: false, progressBar: 0 };
      }
    }));
  };

  // Update the toggle recording function to manage both recording and active states
  const toggleRecording = (e) => {
    e.preventDefault();
    
    if (!isVoiceActive) {
      // Start voice interaction mode
      setIsVoiceActive(true);
      setIsRecording(true);
      setVoiceInteractionState('listening');
      setVoiceOutput('');
      
      // Simulate voice recognition with staged text output
      const phrases = [
        'I need a h',
        'I need a home',
        'I need a home loan',
        'I need a home loan with',
        'I need a home loan with the best',
        'I need a home loan with the best interest rate',
        'I need a home loan with the best interest rate. My budget',
        'I need a home loan with the best interest rate. My budget is around',
        'I need a home loan with the best interest rate. My budget is around ₹40 lakhs.'
      ];
      
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < phrases.length) {
          setVoiceOutput(phrases[i]);
          i++;
        } else {
          clearInterval(typingInterval);
          // User finished speaking - transition to processing
          setIsRecording(false);
          setVoiceInteractionState('processing');
          
          // Then after a brief delay, transition to responding
          setTimeout(() => {
            setVoiceInteractionState('responding');
            // Process the message but keep voice interaction active
            processVoiceMessage('I need a home loan with the best interest rate. My budget is around ₹40 lakhs.');
          }, 1000);
        }
      }, 300);
    } else if (isRecording) {
      // If already recording, stop recording but stay in voice active mode
      setIsRecording(false);
      setVoiceInteractionState('processing');
      setVoiceOutput('Processing your request...');
      
      // Simulate processing delay then transition to responding
      setTimeout(() => {
        setVoiceInteractionState('responding');
        // Process with whatever was captured so far
        processVoiceMessage(voiceOutput || "Looking for loan options");
      }, 1000);
    } else {
      // If voice active but not recording, start a new recording
      setIsRecording(true);
      setVoiceInteractionState('listening');
      setVoiceOutput('');
    }
  };
  
  // Add a dedicated method to cancel voice interaction
  const cancelVoiceInteraction = () => {
    setIsVoiceActive(false);
    setIsRecording(false);
    setVoiceInteractionState('idle');
    setVoiceOutput('');
  };
  
  // Add a method to process voice messages that maintains the voice active state
  const processVoiceMessage = (text) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { sender: 'user', text, language: currentLanguage }]);
    
    // Simulate AI thinking/processing
    setTimeout(() => {
      // Add AI response
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'I understand you\'re looking for a home loan with a good interest rate for a budget of ₹40 lakhs. Would you like me to suggest some options based on your credit profile?',
        language: currentLanguage,
        isPlaying: false,
        progressBar: 0
      }]);
      
      // After response is given, transition back to listening mode
      setTimeout(() => {
        setVoiceInteractionState('listening');
        setIsRecording(true);
        setVoiceOutput(''); // Reset for next input
      }, 1000);
    }, 1500);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const sendMessage = (text = inputText) => {
    if (!text.trim()) return;
    
    setMessages([...messages, { sender: 'user', text, language: currentLanguage }]);
    setInputText('');
    
    setIsTyping(true);

    // Simple response without loan-related content
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'I understand your message. How else can I assist you today?',
        language: currentLanguage,
        isPlaying: false,
        progressBar: 0
      }]);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  // Modified to update user language preference in Firebase
  const selectLanguage = async (language) => {
    setCurrentLanguage(language.name);
    setShowLanguageMenu(false);
    
    // Update user language preference in Firebase if user is authenticated
    if (user && auth.currentUser) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          lang: language.name
        });
        console.log('User language preference updated successfully');
      } catch (error) {
        console.error('Error updating user language preference:', error);
      }
    }
  };

  // Generate orb blob path based on voice amplitude and interaction state
  const generateBlobPath = () => {
    if (!isVoiceActive) return "M50,10 A40,40 0 1,1 49.9,10 Z";
    
    const points = 8;
    let amplitude = 15 * voiceAmplitude;
    
    // Adjust amplitude based on interaction state
    if (voiceInteractionState === 'processing') {
      amplitude *= 0.5; // Subtler movement when processing
    } else if (voiceInteractionState === 'responding') {
      amplitude *= 1.2; // More pronounced when responding
    }
    
    let path = "M";
    
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const variance = Math.random() * amplitude;
      const radius = 40 + variance;
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;
      
      if (i === 0) {
        path += `${x},${y}`;
      } else {
        path += ` A${radius},${radius} 0 0,1 ${x},${y}`;
      }
    }
    
    path += " Z";
    return path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white mt-10">
      {/* Hero Section */}
      <section className="relative py-16 px-6 md:px-12 lg:px-24">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Meet Sage: Your Financial AI Assistant
              </h1>
              <p className="mt-6 text-lg text-gray-300">
                Unlock financial clarity with Sage, your personal AI guide through complex financial decisions.
                From home loans to investment advice, Sage makes expert financial knowledge accessible in 10 Indian languages.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm py-2 px-4 rounded-lg border border-gray-700/30 hover:border-blue-500/50 transition-all">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  <span>AI-Powered Recommendations</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm py-2 px-4 rounded-lg border border-gray-700/30 hover:border-purple-500/50 transition-all">
                  <Languages className="h-5 w-5 text-purple-400" />
                  <span>Multilingual Support</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm py-2 px-4 rounded-lg border border-gray-700/30 hover:border-green-500/50 transition-all">
                  <Headphones className="h-5 w-5 text-green-400" />
                  <span>Voice Enabled</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 md:w-64 md:h-64 bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-700/50 shadow-xl flex items-center justify-center overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 filter blur-xl opacity-50 absolute"></div>
                      <div className="z-10 text-9xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">S</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 px-6 md:px-12 lg:px-24 bg-black/30">
        <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-12">How Sage Can Help You</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30 hover:border-blue-500/30 transition-all hover:scale-105">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <Home className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Home Loan Assistance</h3>
              <p className="text-gray-400">Compare offers from multiple banks, understand eligibility criteria, and get personalized recommendations.</p>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30 hover:border-purple-500/30 transition-all hover:scale-105">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multilingual Support</h3>
              <p className="text-gray-400">Communicate in 10 Indian languages including Hindi, Bengali, Tamil, Telugu, Gujarati, and more.</p>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30 hover:border-green-500/30 transition-all hover:scale-105">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <Volume2 className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Voice Interactions</h3>
              <p className="text-gray-400">Speak naturally with Sage and get voice responses for a hands-free experience.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Chat Interface Section */}
      <section className="py-16 px-4 md:px-12 lg:px-24">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-8">Talk to Sage Now</h2>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Ask about loan options, interest rates, or any financial questions. Sage is here to help you make informed decisions.
          </p>
          
          {/* Chat Interface */}
          <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden">
            {/* Chat header with current language display */}
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium">Sage</h3>
                <p className="text-xs text-gray-300">AI-Powered • Multilingual • Voice Support</p>
              </div>
              
              {/* Added: Current language display */}
              <div className="ml-auto flex items-center space-x-2">
                <div className="text-xs bg-black/30 rounded-full px-3 py-1 flex items-center">
                  <Globe className="h-3 w-3 mr-1.5 text-blue-400" />
                  <span className="text-blue-300">{currentLanguage}</span>
                </div>
                <div className="text-xs bg-black/30 rounded-full px-3 py-1">
                  <span className="text-green-400">Powered by Sarvam AI</span>
                </div>
              </div>
            </div>
            
            {/* Chat content - add ref to the container */}
            <div 
              ref={chatContainerRef} 
              className="p-4 h-80 md:h-96 overflow-y-auto bg-gradient-to-b from-gray-900/50 to-black/80 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            >
              {messages.map((message, index) => (
                <div key={index} className={`mb-5 ${message.sender === 'user' ? 'ml-auto max-w-[80%]' : 'max-w-[85%]'}`}>
                  {message.sender === 'user' ? (
                    <>
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl rounded-tr-none p-4 shadow-sm">
                        <p className="text-white">{message.text}</p>
                      </div>
                      <div className="flex items-center justify-end mt-2 text-xs text-gray-500">
                        <span className="mr-2">Just now</span>
                        <span>•</span>
                        <span className="ml-2 font-medium">{user?.name || 'You'}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 border border-gray-700/50 shadow-sm">
                        {message.text && <p className="text-gray-200">{message.text}</p>}
                        {message.translation && <p className="text-gray-200 mt-2">{message.translation}</p>}
                        
                        {/* Audio playback option */}
                        <div className="mt-3 flex items-center space-x-2">
                          <button 
                            className="bg-gray-700/50 hover:bg-gray-700 rounded-full p-1.5 transition-colors"
                            onClick={() => toggleAudio(index)}
                          >
                            {message.isPlaying ? 
                              <PauseCircle className="h-3.5 w-3.5 text-blue-400" /> : 
                              <PlayCircle className="h-3.5 w-3.5 text-blue-400" />
                            }
                          </button>
                          <div className="bg-gray-700/30 h-1 flex-grow rounded-full">
                            <div 
                              className="bg-blue-500/50 h-1 rounded-full transition-all duration-300" 
                              style={{ width: `${message.progressBar}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span className="font-medium mr-2">Sage</span>
                        <span>•</span>
                        <span className="ml-2">{message.language || currentLanguage}</span>
                        <span className="ml-2">•</span>
                        <span className="ml-2">Just now</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="max-w-[85%] mb-5">
                <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 border border-gray-700/50 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* We can keep this as a marker but it won't be used for scrolling */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Voice orb animation overlay - ENHANCED VOICE ORB UI */}
          {isVoiceActive && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="flex flex-col items-center">
                {/* Dynamic Voice Orb */}
                <div className="relative w-64 h-64">
                  {/* Outer glow effect */}
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 filter blur-xl opacity-30 ${recordingPulse ? 'scale-110' : 'scale-100'} transition-all duration-300`}></div>
                  
                  {/* SVG Voice Visualizer */}
                  <div ref={voiceVisualizerRef} className="absolute inset-0 flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                      {/* Background gradient */}
                      <defs>
                        <linearGradient id="orbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      
                      {/* Pulsing rings */}
                      {[...Array(3)].map((_, i) => (
                        <circle 
                          key={i} 
                          cx="50" 
                          cy="50" 
                          r={40 + i * 10} 
                          fill="none" 
                          stroke="url(#orbGradient)" 
                          strokeWidth="0.5" 
                          strokeOpacity={0.3 - i * 0.1}
                          className={`animate-ping`} 
                          style={{ animationDuration: `${3 + i * 0.5}s` }}
                        />
                      ))}
                      
                      {/* Dynamic blob shape that morphs with voice */}
                      <path 
                        d={generateBlobPath()} 
                        fill="url(#orbGradient)" 
                        filter="url(#glow)"
                        className="transition-all duration-100"
                      />
                      
                      {/* Center icon - changes based on voice state */}
                      <circle cx="50" cy="50" r="15" fill="#111827" />
                      <g transform="translate(38, 38) scale(0.25)">
                        {isRecording ? (
                          <div className="animate-pulse">
                            <circle cx="24" cy="24" r="24" fill="none" stroke="white" strokeWidth="4" />
                          </div>
                        ) : voiceInteractionState === 'processing' ? (
                          <div className="animate-spin">
                            <circle cx="24" cy="24" r="24" fill="none" stroke="white" strokeWidth="4" strokeDasharray="60" strokeDashoffset="20" />
                          </div>
                        ) : (
                          <div className="animate-pulse">
                            <circle cx="24" cy="24" r="24" fill="none" stroke="white" strokeWidth="4" />
                          </div>
                        )}
                      </g>
                    </svg>
                  </div>
                  
                  {/* Sound wave visualization circles */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {[...Array(8)].map((_, i) => {
                      const size = Math.max(5, 15 * voiceAmplitude);
                      const angle = (i / 8) * Math.PI * 2;
                      const x = Math.cos(angle) * 55;
                      const y = Math.sin(angle) * 55;
                      const delay = i * 0.1;
                      
                      return (
                        <div 
                          key={i}
                          className="absolute bg-white rounded-full"
                          style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            transform: `translate(${x}px, ${y}px)`,
                            opacity: 0.6,
                            transitionDelay: `${delay}s`,
                            transition: 'all 150ms ease-out'
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                
                {/* Voice output text - changes based on state */}
                <div className="mt-8 max-w-md bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                  <p className="text-blue-400 text-center font-medium mb-2">
                    {isRecording ? "Listening..." : 
                     voiceInteractionState === 'processing' ? "Processing..." : 
                     "Responding..."}
                  </p>
                  <p className="text-white text-center text-lg">
                    {voiceOutput || (isRecording ? "Speak now..." : 
                     voiceInteractionState === 'processing' ? "Analyzing your request..." : 
                     "Here's what I found...")}
                  </p>
                </div>
                
                {/* Control buttons - now includes cancel and toggle mic buttons */}
                <div className="mt-6 flex space-x-4">
                  <button 
                    onClick={cancelVoiceInteraction}
                    className="px-6 py-2 bg-gray-800/70 backdrop-blur-sm rounded-full border border-gray-700/50 text-white hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  {/* Only show toggle mic button if in responding state */}
                  {voiceInteractionState === 'responding' && (
                    <button 
                      onClick={toggleRecording}
                      className="px-6 py-2 bg-blue-600/70 backdrop-blur-sm rounded-full border border-blue-500/50 text-white hover:bg-blue-500 transition-colors"
                    >
                      Speak Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Chat input */}
          <div className="sticky bottom-0 border-t border-gray-800 p-3 bg-gray-900/80 backdrop-blur-sm">
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2 flex items-center">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="bg-transparent text-white text-sm flex-1 focus:outline-none"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              <div className="flex space-x-2 items-center">
                <div className="relative">
                  <button 
                    className={`w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors ${showLanguageMenu ? 'bg-gray-600' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setShowLanguageMenu(!showLanguageMenu);
                    }}
                  >
                    <Globe className="h-4 w-4" />
                  </button>
                  
                  {/* Language selection menu with current language indicator */}
                  {showLanguageMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-2 w-40 z-10">
                      <div className="max-h-40 overflow-y-auto">
                      {languages.map((lang) => (
                          <div 
                            key={lang.code}
                            className={`flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer ${currentLanguage === lang.name ? 'bg-gray-700' : ''}`}
                            onClick={() => selectLanguage(lang)}
                          >
                            <span className="mr-2">{lang.flag}</span>
                            <span className="text-white text-sm">{lang.name}</span>
                            {currentLanguage === lang.name && (
                              <Check className="h-3 w-3 ml-auto text-blue-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${isVoiceActive ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} transition-colors ${recordingPulse && isVoiceActive ? 'animate-pulse' : ''}`}
                  onClick={toggleRecording}
                >
                  <Mic className="h-4 w-4" />
                </button>
                
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-700/20 hover:shadow-purple-700/40 transition-all"
                  onClick={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                >
                  <SendHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};

export default SageChat;