"use client";
import React, { useState, useRef, useEffect } from "react";
import { Globe, SendHorizontal, MessageCircle, Plus, Loader2, X, Menu, Banknote, BadgePercent } from "lucide-react";
import { decodeBase64Audio, playAudio } from "@/utils/audioUtils";
import { db } from "@/firebase";
import { collection, addDoc, query, where, onSnapshot, orderBy, updateDoc, doc, getDoc, getDocs } from "firebase/firestore";
import VoiceChat from "./VoiceChat";

const ChatInterface = ({ user }) => {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState({ code: "en-IN", name: "English" });
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const langMenuRef = useRef(null);

  const languages = [
    { code: "en-IN", name: "English" },
    { code: "hi-IN", name: "Hindi" },
    { code: "bn-IN", name: "Bengali" },
    { code: "gu-IN", name: "Gujarati" },
    { code: "kn-IN", name: "Kannada" },
    { code: "ml-IN", name: "Malayalam" },
    { code: "mr-IN", name: "Marathi" },
    { code: "pa-IN", name: "Punjabi" },
    { code: "ta-IN", name: "Tamil" },
    { code: "te-IN", name: "Telugu" }
  ];

  // Fetch loans from Firebase
  const fetchLoans = async (preferences) => {
    try {
      const loansRef = collection(db, "loans");
      let q = query(loansRef);
      
      if(preferences?.amount) {
        q = query(q, where("minAmount", "<=", preferences.amount));
        q = query(q, where("maxAmount", ">=", preferences.amount));
      }
      if(preferences?.tenure) {
        q = query(q, where("tenure", "==", preferences.tenure));
      }
      if(preferences?.interestRate) {
        q = query(q, where("interestRate", "<=", preferences.interestRate));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching loans:", error);
      return [];
    }
  };

  // Save user preferences
  const saveUserPreferences = async (preferences) => {
    if (!user?.uid) return;
    
    try {
      await updateDoc(doc(db, "users", user.uid), {
        preferences: {
          loanAmount: preferences.amount,
          preferredTenure: preferences.tenure,
          maxInterestRate: preferences.interestRate,
          lastUpdated: new Date()
        }
      });
      return true;
    } catch (error) {
      console.error("Error saving preferences:", error);
      return false;
    }
  };

  // Extract preferences from message
  const extractPreferences = (text) => {
    const amountMatch = text.match(/₹?(\d+,?\d+)/);
    const tenureMatch = text.match(/(\d+)\s*(months|years)/i);
    const interestMatch = text.match(/(\d+)% interest/i);

    return {
      amount: amountMatch ? parseInt(amountMatch[1].replace(/,/g, '')) : null,
      tenure: tenureMatch ? `${tenureMatch[1]} ${tenureMatch[2]}` : null,
      interestRate: interestMatch ? parseInt(interestMatch[1]) : null
    };
  };

  useEffect(() => {
    const fetchUserLanguage = async () => {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().lang) {
            const userLang = userDoc.data().lang;
            const matchedLang = languages.find(l => l.code === userLang.code || l.code === userLang);
            if (matchedLang) setCurrentLanguage(matchedLang);
          }
        } catch (err) {
          console.error("Error fetching user language:", err);
        }
      }
    };
    fetchUserLanguage();
  }, [user]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user?.uid) {
      setIsLoading(true);
      const q = query(
        collection(db, "chats"), 
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        try {
          const sessions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate()
          }));
          setChatSessions(sessions);
          if (!currentSessionId && sessions.length > 0) {
            setCurrentSessionId(sessions[0].id);
          }
          setInitialized(true);
          setIsLoading(false);
        } catch (err) {
          console.error("Error processing chat sessions:", err);
          setError("Failed to load chat history");
          setIsLoading(false);
        }
      }, (error) => {
        console.error("Error fetching chat sessions:", error);
        setError("Failed to load chat history");
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (currentSessionId) {
      const q = query(
        collection(db, "messages"), 
        where("sessionId", "==", currentSessionId),
        orderBy("timestamp", "asc")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        try {
          const loadedMessages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate()
          }));
          setMessages(loadedMessages);

          const session = chatSessions.find(s => s.id === currentSessionId);
          if (session?.title === "New Chat" && loadedMessages.length > 0) {
            const firstUserMessage = loadedMessages.find(m => m.sender === "user");
            if (firstUserMessage) {
              updateChatTitle(currentSessionId, truncateTitle(firstUserMessage.text));
            }
          }
        } catch (err) {
          console.error("Error processing messages:", err);
          setError("Failed to load messages");
        }
      }, (error) => {
        console.error("Error fetching messages:", error);
        setError("Failed to load messages");
      });
      return () => unsubscribe();
    } else {
      setMessages([]);
    }
  }, [currentSessionId, chatSessions]);

  const truncateTitle = (text) => text.length > 30 ? `${text.substring(0, 30)}...` : text;

  const updateChatTitle = async (sessionId, title) => {
    try {
      await updateDoc(doc(db, "chats", sessionId), { title });
    } catch (error) {
      console.error("Error updating chat title:", error);
    }
  };

  const createNewChatSession = async () => {
    if (!user?.uid) return;
    
    setIsLoading(true);
    const newSession = {
      userId: user.uid,
      language: currentLanguage,
      timestamp: new Date(),
      title: "New Chat"
    };

    try {
      const docRef = await addDoc(collection(db, "chats"), newSession);
      setCurrentSessionId(docRef.id);
      setMessages([]);
      if (window.innerWidth < 768) setShowSidebar(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (error) {
      console.error("Error creating new chat:", error);
      setError("Failed to create new chat");
    } finally {
      setIsLoading(false);
    }
  };

  const switchSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  const saveMessage = async (message) => {
    if (!currentSessionId || !user?.uid) return;
    try {
      await addDoc(collection(db, "messages"), {
        ...message,
        sessionId: currentSessionId,
        timestamp: new Date(),
        userId: user.uid
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const generateSpeech = async (text) => {
    try {
      const response = await fetch("/api/Sarvam/TextToSpeech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: [text],
          target_language_code: currentLanguage.code,
          speaker: "meera",
          model: "bulbul:v1"
        }),
      });

      if (!response.ok) throw new Error("TTS request failed");
      const data = await response.json();
      if (data.audios?.[0]) {
        playAudio(decodeBase64Audio(data.audios[0]));
        return data.audios[0];
      }
      return null;
    } catch (error) {
      console.error("TTS Error:", error);
      return null;
    }
  };

  const sendMessage = async (rawText = inputText, isVoice = false) => {
    const text = String(rawText).trim();
    if (!text || !currentSessionId || !user?.uid) return;

    try {
      setIsTyping(true);
      const userMessage = { 
        sender: "user", 
        text, 
        language: currentLanguage.code,
        audio: null
      };
      await saveMessage(userMessage);
      setInputText("");

      // Check for loan recommendation intent
      const isRecommendationQuery = text.toLowerCase().includes("recommend") || 
                                  text.toLowerCase().includes("suggest") || 
                                  text.toLowerCase().includes("best loan");

      // Extract and save preferences
      let recommendations = [];
      if (isRecommendationQuery) {
        const preferences = extractPreferences(text);
        await saveUserPreferences(preferences);
        recommendations = await fetchLoans(preferences);
      }

      // LLM API Call
      const llmResponse = await fetch("/api/LLM", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: text,
          language: currentLanguage.code,
          conversationHistory: messages.map(msg => ({
            role: msg.sender === "user" ? "user" : "model",
            content: msg.text
          })),
          userPreferences: user.preferences
        }),
      });

      if (!llmResponse.ok) throw new Error("LLM request failed");
      const llmData = await llmResponse.json();
      const responseText = llmData.output;

      // Save bot response with recommendations
      const botMessage = {
        sender: "bot",
        text: responseText,
        language: currentLanguage.code,
        audio: isVoice ? "voice-response" : null,
        ...(recommendations.length > 0 && { recommendations })
      };
      await saveMessage(botMessage);

    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, I encountered an error. Please try again.",
        language: currentLanguage.code,
        audio: null
      };
      await saveMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLanguageChange = async (lang) => {
    setCurrentLanguage(lang);
    setShowLangMenu(false);
    if (user?.uid) {
      try {
        await updateDoc(doc(db, "users", user.uid), { lang });
      } catch (error) {
        console.error("Error updating user language:", error);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 mt-16 md:mt-0">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 sticky top-0 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 z-20 shadow-lg">
        <button 
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 rounded-lg bg-gray-700/80 text-white hover:bg-gray-600 transition-all duration-200 shadow-md"
        >
          {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <h1 className="text-lg font-semibold text-white">Sage Chat</h1>
        <div className="relative" ref={langMenuRef}>
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="p-2 rounded-lg bg-gray-700/80 hover:bg-gray-600 transition-all duration-200 shadow-md"
          >
            <Globe className="h-5 w-5 text-white" />
          </button>
          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl overflow-hidden z-50 border border-gray-700/50 backdrop-blur-sm">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang)}
                  className={`block w-full text-left px-4 py-2.5 text-sm ${currentLanguage.code === lang.code ? 'bg-blue-600/90' : 'hover:bg-gray-700/70'} text-white transition-colors duration-150`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat History Sidebar */}
      <div className={`${showSidebar ? 'fixed inset-0 z-30 md:relative animate-slide-in' : 'hidden'} md:block md:animate-none w-full md:w-72 lg:w-80 bg-gray-800/90 backdrop-blur-sm border-r border-gray-700/50 overflow-y-auto shadow-xl`}>
        <div className="sticky top-0 bg-gray-800/95 backdrop-blur-sm p-4 border-b border-gray-700/50 z-10 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Chat History</h2>
            <div className="flex space-x-2">
              <button
                onClick={createNewChatSession}
                className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Plus className="h-5 w-5 text-white" />
              </button>
              {window.innerWidth < 768 && (
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-2.5">
          {!initialized ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-white text-sm shadow-md hover:shadow-lg"
              >
                Retry
              </button>
            </div>
          ) : chatSessions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400">No chats yet</p>
              <button
                onClick={createNewChatSession}
                className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 text-white text-sm shadow-md hover:shadow-lg"
              >
                Start a new chat
              </button>
            </div>
          ) : (
            chatSessions.map(session => (
              <div
                key={session.id}
                onClick={() => switchSession(session.id)}
                className={`p-3.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  session.id === currentSessionId 
                    ? 'bg-gradient-to-r from-blue-700 to-blue-600 shadow-md' 
                    : 'hover:bg-gray-700/70 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center">
                  <MessageCircle className={`h-4 w-4 ${session.id === currentSessionId ? 'text-blue-200' : 'text-gray-400'} mr-2`} />
                  <p className="text-white font-medium truncate flex-1">{session.title}</p>
                </div>
                <p className="text-xs text-gray-400 mt-2 pl-6">
                  {session.timestamp?.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col h-[calc(100vh-56px)] md:h-screen">
        {/* Chat Header - Desktop */}
        <div className="hidden md:flex p-4 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-700 to-blue-500 rounded-lg shadow-md">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Sage Chat</h1>
              <p className="text-sm text-gray-400">
                {currentSessionId ? 
                  chatSessions.find(s => s.id === currentSessionId)?.title || "Active Chat" : 
                  "No chat selected"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-2 bg-gray-700/80 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors shadow-md">
                <Globe className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white font-medium">{currentLanguage.name}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden z-50 hidden group-hover:block border border-gray-700/50 transform opacity-0 group-hover:opacity-100 transition-all duration-200">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang)}
                    className={`block w-full text-left px-4 py-2.5 text-sm ${currentLanguage.code === lang.code ? 'bg-blue-600/90' : 'hover:bg-gray-700/70'} text-white transition-colors duration-150`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        {currentSessionId && (
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-5 bg-gradient-to-b from-gray-900 to-gray-850 scrollbar scrollbar-thumb-gray-700 scrollbar-track-transparent"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="p-6 rounded-full bg-gray-800/50 mb-4">
                  <MessageCircle className="h-12 w-12 text-blue-500 opacity-70" />
                </div>
                <p className="text-gray-300 mb-3 text-lg font-medium">No messages yet</p>
                <p className="text-gray-500">Type a message or use voice input to start</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={message.id || index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                  <div 
                    className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 rounded-2xl shadow-md ${
                      message.sender === "user" 
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white" 
                        : "bg-gradient-to-br from-gray-800 to-gray-750 text-white border border-gray-700/50"
                    }`}
                  >
                    {message.recommendations ? (
                      <div className="loan-recommendations space-y-3">
                        <div className="flex items-center space-x-2 mb-3">
                          <Banknote className="h-5 w-5 text-green-400" />
                          <h3 className="text-lg font-semibold text-white">Top Loan Recommendations</h3>
                        </div>
                        {message.recommendations.map((loan, i) => (
                          <div key={i} className="bg-gray-700/50 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-blue-300 font-medium">{loan.bankName}</h4>
                              <BadgePercent className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <p className="text-gray-300">Amount: 
                                <span className="ml-2 text-white">₹{loan.minAmount?.toLocaleString()} - ₹{loan.maxAmount?.toLocaleString()}</span>
                              </p>
                              <p className="text-gray-300">Rate: 
                                <span className="ml-2 text-white">{loan.interestRate}%</span>
                              </p>
                              <p className="text-gray-300">Tenure: 
                                <span className="ml-2 text-white">{loan.tenure} months</span>
                              </p>
                              <p className="text-gray-300">Type: 
                                <span className="ml-2 text-white capitalize">{loan.loanType?.replace("_", " ")}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
                    )}
                    <p className="text-xs mt-2 text-gray-300 opacity-75 flex items-center">
                      {message.sender === "bot" && (
                        <span className="mr-1 text-blue-400 font-medium">Sage</span>
                      )}
                      {message.timestamp?.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-gradient-to-br from-gray-800 to-gray-750 p-4 rounded-2xl shadow-md">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Area */}
        {currentSessionId && (
          <div className="p-4 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700/50 shadow-up">
            <div className="flex space-x-3">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isTyping && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-3 bg-gray-700/80 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner transition-all duration-200"
                disabled={isTyping}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!inputText.trim() || isTyping}
                className={`p-3 rounded-xl transition-all duration-200 shadow-md ${
                  !inputText.trim() || isTyping 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white hover:shadow-lg'
                }`}
              >
                <SendHorizontal className="h-5 w-5" />
              </button>
              <VoiceChat
                onTranscript={(text) => sendMessage(text, true)}
                language={currentLanguage.code}
                disabled={isTyping}
                model="saaras:flash"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 p-3 rounded-xl text-white shadow-md hover:shadow-lg transition-all duration-200"
              />
            </div>
            <div className="text-xs text-gray-500 text-center mt-2">
              {currentLanguage.name !== "English" && `Responding in ${currentLanguage.name}`}
              {user.preferences && ` · Current preferences: ₹${user.preferences.loanAmount?.toLocaleString() || '--'}, ${user.preferences.preferredTenure || '--'} tenure`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;