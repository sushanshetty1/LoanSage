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

const SageChat = () => {
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
  const [recordingPulse, setRecordingPulse] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceOutput, setVoiceOutput] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const initialRender = useRef(true);
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', flag: 'हि' },
    { code: 'bn', name: 'Bengali', flag: 'বা' },
    { code: 'gu', name: 'Gujarati', flag: 'ગુ' },
    { code: 'kn', name: 'Kannada', flag: 'ಕ' },
    { code: 'ml', name: 'Malayalam', flag: 'മ' },
    { code: 'mr', name: 'Marathi', flag: 'म' },
    { code: 'pa', name: 'Punjabi', flag: 'ਪੰ' },
    { code: 'ta', name: 'Tamil', flag: 'த' },
    { code: 'te', name: 'Telugu', flag: 'తె' }
  ];

  const loanOptions = [
    {
      name: 'SBI Home Loan',
      provider: 'State Bank of India',
      rate: '8.70%',
      features: ['No processing fee', '30 year term'],
      best: false
    },
    {
      name: 'HDFC Bank Home Loan',
      provider: 'HDFC Bank',
      rate: '8.50%',
      features: ['₹2,500 processing fee', '25 year term'],
      best: true
    }
  ];

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

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingPulse(prev => !prev);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleAudio = (index) => {
    setMessages(messages.map((message, i) => {
      if (i === index) {
        return { ...message, isPlaying: !message.isPlaying, progressBar: message.isPlaying ? 0 : message.progressBar };
      } else {
        return { ...message, isPlaying: false, progressBar: 0 };
      }
    }));
  };

  const toggleRecording = (e) => {
    e.preventDefault();
    setIsRecording(!isRecording);
    if (!isRecording) {
      setVoiceOutput('');
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
          sendMessage('I need a home loan with the best interest rate. My budget is around ₹40 lakhs.');
          setIsRecording(false);
          setVoiceOutput('');
        }
      }, 300);
    } else {
      setVoiceOutput('');
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const sendMessage = (text = inputText) => {
    if (!text.trim()) return;
    
    setMessages([...messages, { sender: 'user', text, language: currentLanguage }]);
    setInputText('');
    
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      if (text.toLowerCase().includes('loan') || text.toLowerCase().includes('home')) {
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: 'I can help you find the best home loan options for ₹40 lakhs. Based on your profile, here are some recommendations:',
          language: currentLanguage,
          loanOptions: loanOptions,
          isPlaying: false,
          progressBar: 0
        }]);
      } else {
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: 'I can assist you with various financial products including home loans, personal loans, and business loans. Would you like to know more about any specific loan type?',
          language: currentLanguage,
          isPlaying: false,
          progressBar: 0
        }]);
      }
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectLanguage = (language) => {
    setCurrentLanguage(language.name);
    setShowLanguageMenu(false);
  };
  
  const handleDetailsButtonClick = (option) => {
    setMessages([...messages, {
      sender: 'bot',
      text: `Here are more details about ${option.name}: \n\n• Interest Rate: ${option.rate} \n• Provider: ${option.provider} \n• EMI for ₹40 lakhs: Approximately ₹31,460/month for 20 years \n• Eligibility: Minimum income of ₹75,000/month \n• Documentation: ID proof, address proof, income proof, and property documents`,
      language: currentLanguage,
      isPlaying: false,
      progressBar: 0
    }]);
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
                        <span className="ml-2 font-medium">You</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 border border-gray-700/50 shadow-sm">
                        {message.text && <p className="text-gray-200">{message.text}</p>}
                        {message.translation && <p className="text-gray-200 mt-2">{message.translation}</p>}
                        
                        {message.loanOptions && (
                          <div className="space-y-3 mt-3">
                            {message.loanOptions.map((option, loanIndex) => (
                              <div key={loanIndex} className={`bg-gray-700/50 p-3 rounded-lg border ${option.best ? 'border-blue-500/50 shadow-sm' : 'border-gray-600/50 hover:border-blue-500/50 transition-colors'} cursor-pointer relative overflow-visible`}>
                                {option.best && (
                                  <div className="absolute -top-2 -right-2">
                                    <div className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-md">
                                      Best Rate
                                    </div>
                                  </div>
                                )}
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="text-blue-400 font-medium">{option.name}</h4>
                                    <p className="text-xs text-gray-300 mt-1">{option.provider}</p>
                                  </div>
                                  <span className="text-emerald-400 font-bold">{option.rate}</span>
                                </div>
                                <div className="mt-2 text-xs text-gray-300 flex space-x-4">
                                  {option.features.map((feature, featIndex) => (
                                    <span key={featIndex} className="flex items-center">
                                      <Check className="h-3 w-3 mr-1 text-emerald-400" /> {feature}
                                    </span>
                                  ))}
                                </div>
                                <button 
                                  onClick={() => handleDetailsButtonClick(option)}
                                  className="mt-2 text-xs bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 px-3 py-1 rounded-md transition-colors"
                                >
                                  View Details
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {!message.loanOptions && message.sender === 'bot' && (
                          <p className="text-gray-300 mt-3 text-sm">Would you like more details on any financial products?</p>
                        )}
                        
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
          
          {/* Voice recording animation overlay */}
          {isRecording && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="relative">
                <div className={`w-24 h-24 rounded-full bg-blue-500/20 absolute inset-0 animate-ping ${recordingPulse ? 'scale-110' : 'scale-100'}`}></div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative z-20">
                  <Mic className="h-10 w-10 text-white animate-pulse" />
                </div>
              </div>
            </div>
          )}
          
          {/* Voice recognition output */}
          {isRecording && (
            <div className="p-3 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm">
              <div className="bg-gray-800/50 rounded-lg p-3 max-h-24 overflow-y-auto">
                <p className="text-blue-400">Listening...</p>
                <p className="text-white">{voiceOutput}</p>
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
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${isRecording ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} transition-colors ${recordingPulse && isRecording ? 'animate-pulse' : ''}`}
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