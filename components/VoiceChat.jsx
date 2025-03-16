"use client"
import React, { useState, useEffect, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

const VoiceChat = ({ onTranscript, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorder = useRef(null);

  useEffect(() => {
    const checkSupport = () => {
      return (
        typeof window !== "undefined" &&
        navigator.mediaDevices &&
        window.MediaRecorder &&
        typeof window.MediaRecorder === "function"
      );
    };
    setIsSupported(checkSupport());
  }, []);

  // Start recording
  const startRecording = async () => {
    if (!isSupported || disabled) return;
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Check for supported MIME types
      const mimeType = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "",
      ].find((type) => type === "" || MediaRecorder.isTypeSupported(type));

      const options = {
        audioBitsPerSecond: 16000,
        ...(mimeType && { mimeType }),
      };

      // Initialize MediaRecorder
      mediaRecorder.current = new MediaRecorder(stream, options);

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks((prev) => [...prev, e.data]);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(audioChunks, {
          type: mediaRecorder.current?.mimeType || "audio/webm",
        });
        await processRecording(blob);
        stream.getTracks().forEach((track) => track.stop());
        setAudioChunks([]);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError(error.message);
      setIsSupported(false);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  // Process the recorded audio
  const processRecording = async (blob) => {
    if (!blob) return;

    try {
      setIsProcessing(true);
      const file = new File([blob], "recording.webm", { type: blob.type });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", "saaras:flash");

      const response = await fetch("/api/Sarvam/SpeechToText", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process audio");
      }

      const data = await response.json();
      if (data.transcript) {
        onTranscript(data.transcript);
      }
    } catch (error) {
      console.error("Processing error:", error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
      }
    };
  }, []);

  // Unsupported browser fallback
  if (!isSupported) {
    return (
      <div className="p-2 rounded-lg bg-gray-700 text-red-400 text-sm">
        {error || "Audio recording not supported in your browser"}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled || !isSupported || isProcessing}
        className={`p-2 rounded-lg ${
          isRecording
            ? "bg-red-600 hover:bg-red-700"
            : "bg-gray-700 hover:bg-gray-600"
        } ${
          disabled || isProcessing ? "opacity-50 cursor-not-allowed" : ""
        } transition-colors`}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isProcessing ? (
          <Loader2 className="h-5 w-5 text-white animate-spin" />
        ) : isRecording ? (
          <Square className="h-5 w-5 text-white" />
        ) : (
          <Mic className="h-8 w-7 rounded-l-lg text-white" />
        )}
      </button>

      {error && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded text-xs whitespace-nowrap">
          {error}
        </div>
      )}

      {isRecording && !error && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-1">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-xs text-red-400">Recording</span>
        </div>
      )}
    </div>
  );
};

export default VoiceChat;