"use client";
import React, { useState, useRef, useEffect } from "react";
import { Mic, Globe, SendHorizontal, MessageCircle, Plus, Loader2, Settings, X , Menu} from "lucide-react";
import { decodeBase64Audio, playAudio } from "@/utils/audioUtils";
import { db } from "@/firebase";
import { collection, addDoc, query, where, onSnapshot, orderBy, updateDoc, doc } from "firebase/firestore";

const ChatInterface = ({ user }) => {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState({ code: "en-IN", name: "English" });
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [audios, setAudios] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const languages = [
    { code: "en-IN", name: "English" },
    { code: "hi-IN", name: "Hindi" },
    { code: "ta-IN", name: "Tamil" },
    { code: "te-IN", name: "Telugu" },
    { code: "kn-IN", name: "Kannada" },
    { code: "ml-IN", name: "Malayalam" },
    { code: 'mr-IN', name: 'Marathi'},
    { code: 'pa-IN', name: 'Punjabi'},
    { code: 'bn-IN', name: 'Bengali'},
    { code: 'gu-IN', name: 'Gujarati'}
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
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
      setIsFetchingMessages(true);
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
          setIsFetchingMessages(false);

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
          setIsFetchingMessages(false);
        }
      }, (error) => {
        console.error("Error fetching messages:", error);
        setError("Failed to load messages");
        setIsFetchingMessages(false);
      });
      
      return () => unsubscribe();
    } else {
      setMessages([]);
    }
  }, [currentSessionId, chatSessions]);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = currentLanguage.code;

        recognitionInstance.onstart = () => {
          setIsListening(true);
        };

        recognitionInstance.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setTimeout(() => sendMessage(transcript), 300);
        };

        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };
        
        setRecognition(recognitionInstance);
      }
    }
  }, [currentLanguage]);

  // Helper functions
  const truncateTitle = (text) => {
    return text.length > 30 ? text.substring(0, 30) + "..." : text;
  };

  const updateChatTitle = async (sessionId, title) => {
    try {
      await updateDoc(doc(db, "chats", sessionId), {
        title
      });
    } catch (error) {
      console.error("Error updating chat title:", error);
    }
  };

  // Chat session management
  const createNewChatSession = async () => {
    if (!user?.uid) return;
    
    setIsLoading(true);
    setError(null);
    
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
      setAudios([]);
      
      // Focus input after creating new chat
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
      
      // On mobile, hide sidebar after creating new chat
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
      setError("Failed to create new chat");
    } finally {
      setIsLoading(false);
    }
  };

  const switchSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    
    // On mobile, hide sidebar after selecting a session
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  // Message handling
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

  // API Integration
  const translateText = async (text, sourceLang, targetLang) => {
    try {
      const response = await fetch("/api/Sarvam/Translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: text,
          source_language_code: sourceLang,
          target_language_code: targetLang,
          model: "bulbul:v1"
        }),
      });

      if (!response.ok) throw new Error("Translation failed");
      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
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
          speech_sample_rate: 22050,
          model: "bulbul:v1"
        }),
      });

      if (!response.ok) throw new Error("TTS request failed");
      const data = await response.json();
      return data.audios[0];
    } catch (error) {
      console.error("TTS Error:", error);
      return null;
    }
  };

  const sendMessage = async (rawText = inputText) => {
    // Sanitize input
    const text = typeof rawText === 'string' ? rawText.trim() : String(rawText).trim();
    if (!text || !currentSessionId || !user?.uid) return;
  
    // Save user message
    const userMessage = { 
      sender: "user", 
      text, 
      language: currentLanguage.code,
      audio: null
    };
    
    saveMessage(userMessage);
    setInputText("");
    setIsTyping(true);
  
    try {
      // Translation and processing
      const englishText = currentLanguage.code !== "en-IN" 
        ? await translateText(text, currentLanguage.code, "en-IN")
        : text;
  
      // LLM API call
      const llmResponse = await fetch("/api/LLM", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: englishText, 
          language: "en-IN" 
        }),
      });
  
      if (!llmResponse.ok) throw new Error("LLM request failed");
      const llmData = await llmResponse.json();
      
      // Generate response
      let responseText = llmData.output;
      if (currentLanguage.code !== "en-IN") {
        responseText = await translateText(responseText, "en-IN", currentLanguage.code);
      }
  
      // Generate speech
      const audioBase64 = await generateSpeech(responseText);
  
      // Save bot response
      const botMessage = {
        sender: "bot",
        text: responseText,
        language: currentLanguage.code,
        audio: audioBase64
      };
      
      saveMessage(botMessage);
      setAudios(prev => [...prev, audioBase64]);
  
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, I encountered an error. Please try again.",
        language: currentLanguage.code,
        audio: null
      };
      
      saveMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
    
    // Update recognition language if it exists
    if (recognition) {
      recognition.lang = lang.code;
    }
  };

  // UI Components
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 mt-18">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <button 
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-white">Sarvam AI Chat</h1>
        <div className="flex items-center space-x-2">
          <div className="relative group">
            <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
              <Globe className="h-5 w-5 text-white" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 hidden group-hover:block">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang)}
                  className={`block w-full text-left px-4 py-2 text-sm ${currentLanguage.code === lang.code ? 'bg-blue-600' : 'hover:bg-gray-700'} text-white`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat History Sidebar */}
      <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-full md:w-64 bg-gray-800 border-r border-gray-700 md:min-h-screen overflow-y-auto`}>
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Chat History</h2>
            <button
              onClick={createNewChatSession}
              className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="New chat"
            >
              <Plus className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          {!initialized ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-white text-sm"
              >
                Retry
              </button>
            </div>
          ) : chatSessions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400">No chats yet</p>
              <button
                onClick={createNewChatSession}
                className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-white text-sm"
              >
                Start a new chat
              </button>
            </div>
          ) : (
            chatSessions.map(session => (
              <div
                key={session.id}
                onClick={() => switchSession(session.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${session.id === currentSessionId ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <p className="text-white font-medium truncate">{session.title}</p>
                <p className="text-xs text-gray-400 mt-1">
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
      <div className="flex-1 flex flex-col h-[calc(100vh-64px)] md:h-screen">
        {/* Chat Header - Desktop */}
        <div className="hidden md:flex p-4 bg-gray-800 border-b border-gray-700 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Sarvam AI Chat</h1>
              <p className="text-sm text-gray-400">
                {isLoading ? "Loading..." : 
                  currentSessionId ? 
                    chatSessions.find(s => s.id === currentSessionId)?.title || "Active Chat" : 
                    "No chat selected"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-2 bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                <Globe className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white">{currentLanguage.name}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 hidden group-hover:block">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang)}
                    className={`block w-full text-left px-4 py-2 text-sm ${currentLanguage.code === lang.code ? 'bg-blue-600' : 'hover:bg-gray-700'} text-white`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden lg:flex p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              aria-label="Toggle sidebar"
            >
              {showSidebar ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Empty State */}
        {!initialized ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-900">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="text-gray-400 mt-4">Loading your chats...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-900">
            <div className="p-4 bg-red-600/20 rounded-full mb-4">
              <X className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-400 text-center mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg text-white font-medium"
            >
              Retry
            </button>
          </div>
        ) : !currentSessionId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-900">
            <div className="p-4 bg-blue-600 rounded-full mb-4">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Sarvam AI Chat</h2>
            <p className="text-gray-400 text-center mb-6">Start a new conversation in your preferred language</p>
            <button
              onClick={createNewChatSession}
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg text-white font-medium flex items-center ${
                isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transition-colors'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : "Start a new chat"}
            </button>
          </div>
        ) : null}

        {/* Chat Messages */}
        {currentSessionId && (
          <div 
            ref={chatContainerRef} 
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900 scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-900"
          >
            {isFetchingMessages ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-red-400 mb-2">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-white text-sm"
                >
                  Retry
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-gray-400 mb-2">No messages yet</p>
                <p className="text-gray-500 text-sm">Type a message to start the conversation</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={message.id || index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div 
                    className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 rounded-lg ${
                      message.sender === "user" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-800 text-white"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    {message.sender === "bot" && message.audio && (
                      <button
                        onClick={() => playAudio(decodeBase64Audio(message.audio))}
                        className="mt-2 px-3 py-1 bg-blue-500/20 rounded-full text-sm text-blue-300 hover:bg-blue-500/30 transition-colors"
                      >
                        Play Audio
                      </button>
                    )}
                    <p className="text-xs mt-2 text-gray-300 opacity-75">
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
              <div className="flex justify-start">
                <div className="bg-gray-800 p-4 rounded-lg">
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
        {currentSessionId && !isFetchingMessages && (
          <div className="p-3 sm:p-4 bg-gray-800 border-t border-gray-700">
            <div className="flex space-x-2 sm:space-x-4">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isTyping && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-2 sm:p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isTyping}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!inputText.trim() || isTyping}
                className={`p-2 sm:p-3 rounded-lg transition-colors ${
                  !inputText.trim() || isTyping 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <SendHorizontal className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  if (recognition) {
                    if (isListening) {
                      recognition.stop();
                    } else {
                      recognition.start();
                    }
                  }
                }}
                disabled={isTyping}
                className={`p-2 sm:p-3 rounded-lg transition-colors ${
                  isListening 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                } ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Mic className={`h-5 w-5 ${isListening ? 'text-white animate-pulse' : 'text-white'}`} />
              </button>
            </div>
            {isListening && (
              <p className="text-xs text-center mt-2 text-blue-400">Listening... Speak now</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;