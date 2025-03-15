"use client";
import React, { useState, useEffect } from "react";
import { db, auth } from "@/firebase";
import { doc, getDoc, updateDoc, collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import ChatInterface from "@/components/ChatInterface";
import VoiceOrb from "@/components/VoiceOrb";
import { decodeBase64Audio, playAudio } from "@/utils/audioUtils";

const SageChat = () => {
  const [user, setUser] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState("English");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceInteractionState, setVoiceInteractionState] = useState("idle");
  const [voiceOutput, setVoiceOutput] = useState("");
  const [audios, setAudios] = useState([]);
  const [messages, setMessages] = useState([]);

  const languages = [
    { code: "en-IN", name: "English", flag: "🇬🇧" },
    { code: "hi-IN", name: "Hindi", flag: "हि" },
    { code: "bn-IN", name: "Bengali", flag: "বা" },
    { code: "gu-IN", name: "Gujarati", flag: "ગુ" },
    { code: "kn-IN", name: "Kannada", flag: "ಕ" },
    { code: "ml-IN", name: "Malayalam", flag: "മ" },
    { code: "mr-IN", name: "Marathi", flag: "म" },
    { code: "pa-IN", name: "Punjabi", flag: "ਪੰ" },
    { code: "ta-IN", name: "Tamil", flag: "த" },
    { code: "te-IN", name: "Telugu", flag: "తె" },
  ];

  // Fetch user data and chat history
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          if (userData.lang) setCurrentLanguage(userData.lang);
        }

        // Fetch chat history
        const q = query(
          collection(db, "sageHistory", currentUser.uid, "messages"),
          orderBy("timestamp", "asc")
        );
        const unsubscribeChat = onSnapshot(q, (querySnapshot) => {
          const chatMessages = [];
          querySnapshot.forEach((doc) => {
            chatMessages.push(doc.data());
          });
          setMessages(chatMessages);
        });

        return () => unsubscribeChat();
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle language selection
  const selectLanguage = async (language) => {
    setCurrentLanguage(language.name);
    if (user && auth.currentUser) {
      try {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          lang: language.name,
        });
      } catch (error) {
        console.error("Error updating language:", error);
      }
    }
  };

  // Save message to Firestore
  const saveMessageToFirestore = async (message) => {
    if (user && auth.currentUser) {
      try {
        await addDoc(collection(db, "sageHistory", auth.currentUser.uid, "messages"), {
          userId: auth.currentUser.uid,
          sender: message.sender,
          text: message.text,
          language: message.language,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Error saving message:", error);
      }
    }
  };

  // Toggle voice recording
  const toggleRecording = async (e) => {
    e.preventDefault();
    if (!isVoiceActive) {
      setIsVoiceActive(true);
      setIsRecording(true);
      setVoiceInteractionState("listening");
      setVoiceOutput("");
    } else if (isRecording) {
      setIsRecording(false);
      setVoiceInteractionState("processing");
      setVoiceOutput("Processing your request...");
      await processVoiceMessage(voiceOutput || "Looking for loan options");
    } else {
      setIsRecording(true);
      setVoiceInteractionState("listening");
      setVoiceOutput("");
    }
  };

  // Cancel voice interaction
  const cancelVoiceInteraction = () => {
    setIsVoiceActive(false);
    setIsRecording(false);
    setVoiceInteractionState("idle");
    setVoiceOutput("");
  };

  // Process voice message
  const processVoiceMessage = async (text) => {
    if (!text.trim()) return;
    // Add logic to process voice input and generate bot response
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white mt-10">
      {/* Chat Interface */}
      <ChatInterface
        user={user}
        currentLanguage={currentLanguage}
        languages={languages}
        selectLanguage={selectLanguage}
        isVoiceActive={isVoiceActive}
        isRecording={isRecording}
        toggleRecording={toggleRecording}
        voiceOutput={voiceOutput}
        saveMessageToFirestore={saveMessageToFirestore}
        audios={audios}
        setAudios={setAudios}
        messages={messages}
        setMessages={setMessages}
      />

      {/* Voice Orb Overlay */}
      {isVoiceActive && (
        <VoiceOrb
          isRecording={isRecording}
          voiceInteractionState={voiceInteractionState}
          voiceOutput={voiceOutput}
          cancelVoiceInteraction={cancelVoiceInteraction}
          toggleRecording={toggleRecording}
          audios={audios}
        />
      )}
    </div>
  );
};

export default SageChat;