"use client";
import React, { useState, useRef, useEffect } from "react";
import { Mic, Globe, SendHorizontal, MessageCircle } from "lucide-react";
import { decodeBase64Audio, playAudio } from "@/utils/audioUtils";

const ChatInterface = ({
  user,
  currentLanguage,
  languages,
  selectLanguage,
  isVoiceActive,
  isRecording,
  toggleRecording,
  voiceOutput,
  saveMessageToFirestore,
  audios,
  setAudios,
  messages,
  setMessages,
}) => {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [recordingTime, setRecordingTime] = useState(25);
  const [recognition, setRecognition] = useState(null);
  const chatContainerRef = useRef(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = currentLanguage.code;

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        sendMessage(transcript); // Automatically send the transcribed message
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
        setRecordingTime(25); // Reset timer
      };

      setRecognition(recognitionInstance);
    } else {
      console.error("Speech Recognition not supported in this browser.");
    }
  }, [currentLanguage]);

  // Handle text input
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Translate text using Sarvam API
  const translateText = async (text, sourceLang, targetLang) => {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sourceLang, targetLang }),
      });

      if (!response.ok) {
        throw new Error("Failed to translate text");
      }

      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Return original text if translation fails
    }
  };

  // Send message to the AI
  const sendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    // Save user message
    const userMessage = { sender: "user", text, language: currentLanguage };
    setMessages([...messages, userMessage]);
    saveMessageToFirestore(userMessage);
    setInputText("");
    setIsTyping(true);

    try {
      // Step 1: Translate user's input to English (if not already in English)
      let englishText = text;
      if (currentLanguage.code !== "en-IN") {
        englishText = await translateText(text, currentLanguage.code, "en-IN");
      }

      // Step 2: Send the translated text to the LLM API
      const llmResponse = await fetch("/api/LLM", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: englishText, language: "en-IN" }),
      });

      if (!llmResponse.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const llmData = await llmResponse.json();
      const englishResponse = llmData.output;

      // Step 3: Translate the LLM's response back to the user's language
      let translatedResponse = englishResponse;
      if (currentLanguage.code !== "en-IN") {
        translatedResponse = await translateText(englishResponse, "en-IN", currentLanguage.code);
      }

      // Save AI response
      const botMessage = { sender: "bot", text: translatedResponse, language: currentLanguage };
      setMessages((prev) => [...prev, botMessage]);
      saveMessageToFirestore(botMessage);

      // Simulate receiving an audio response (replace with actual TTS API if needed)
      const simulatedAudio = "base64EncodedAudioString"; // Replace with actual TTS API response
      setAudios((prev) => [...prev, simulatedAudio]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = { sender: "bot", text: "Sorry, I couldn't process your request. Please try again.", language: currentLanguage };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  // Timer for voice recording
  useEffect(() => {
    if (isRecording) {
      const timer = setInterval(() => {
        setRecordingTime((prev) => prev - 1);
      }, 1000);

      if (recordingTime === 0) {
        toggleRecording(); // Stop recording
        setRecordingTime(25); // Reset timer
      }

      return () => clearInterval(timer);
    }
  }, [isRecording, recordingTime]);

  // Start/stop voice recording
  const handleVoiceRecording = () => {
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
    toggleRecording();
  };

  return (
    <section className="py-16 px-4 md:px-12 lg:px-24">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-8">Talk to Sage Now</h2>
        <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden">
          {/* Chat header */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium">Sage</h3>
              <p className="text-xs text-gray-300">AI-Powered • Multilingual • Voice Support</p>
            </div>
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

          {/* Chat content */}
          <div
            ref={chatContainerRef}
            className="p-4 h-80 md:h-96 overflow-y-auto bg-gradient-to-b from-gray-900/50 to-black/80 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
          >
            {messages.map((message, index) => (
              <div key={index} className={`mb-5 ${message.sender === "user" ? "ml-auto max-w-[80%]" : "max-w-[85%]"}`}>
                {message.sender === "user" ? (
                  <>
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl rounded-tr-none p-4 shadow-sm">
                      <p className="text-white">{message.text}</p>
                    </div>
                    <div className="flex items-center justify-end mt-2 text-xs text-gray-500">
                      <span className="mr-2">Just now</span>
                      <span>•</span>
                      <span className="ml-2 font-medium">{user?.name || "You"}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 border border-gray-700/50 shadow-sm">
                      <p className="text-gray-200">{message.text}</p>
                      {audios[index] && (
                        <button
                          onClick={() => playAudio(decodeBase64Audio(audios[index]))}
                          className="mt-2 px-3 py-1 bg-blue-500/20 rounded-full text-sm text-blue-300 hover:bg-blue-500/30"
                        >
                          Play Audio
                        </button>
                      )}
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
          </div>

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
                <button
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${isRecording ? "bg-red-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"} transition-colors`}
                  onClick={handleVoiceRecording}
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
  );
};

export default ChatInterface;