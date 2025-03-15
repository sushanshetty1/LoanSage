import React, { useEffect, useState } from "react";
import { decodeBase64Audio, playAudio } from "@/utils/audioUtils";

const VoiceOrb = ({
  isRecording,
  voiceInteractionState,
  voiceOutput,
  cancelVoiceInteraction,
  toggleRecording,
  audios,
}) => {
  const [pulseSize, setPulseSize] = useState(0);
  const [rotation, setRotation] = useState(0);
  
  // Create pulsing effect when recording
  useEffect(() => {
    let animationFrame;
    let angle = 0;
    
    const animate = () => {
      if (isRecording || voiceInteractionState === "responding") {
        setPulseSize(Math.sin(angle) * 10 + 95);
        setRotation(prev => (prev + 0.2) % 360);
        angle += 0.08;
      } else if (voiceInteractionState === "processing") {
        setRotation(prev => (prev + 0.5) % 360);
      }
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isRecording, voiceInteractionState]);
  
  // Get color based on current state
  const getOrbColors = () => {
    if (isRecording) {
      return {
        primary: "from-red-500 to-rose-600",
        secondary: "from-orange-400 to-red-500",
        wave: "stroke-red-400",
        glow: "bg-red-500"
      };
    } else if (voiceInteractionState === "processing") {
      return {
        primary: "from-amber-500 to-yellow-600",
        secondary: "from-yellow-400 to-amber-500",
        wave: "stroke-yellow-400",
        glow: "bg-yellow-500"
      };
    } else {
      return {
        primary: "from-blue-500 to-purple-600",
        secondary: "from-indigo-400 to-purple-500",
        wave: "stroke-blue-400",
        glow: "bg-blue-500"
      };
    }
  };
  
  const colors = getOrbColors();
  
  // Generate wave points for SVG
  const generateWavePoints = (count = 12, amplitude = 15) => {
    const points = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const offset = isRecording ? Math.sin(rotation / 20 + i) * amplitude : amplitude / 2;
      points.push({
        x: 50 + Math.cos(angle) * (32 + offset),
        y: 50 + Math.sin(angle) * (32 + offset),
      });
    }
    return points;
  };
  
  const wavePoints = generateWavePoints();
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        {/* Voice Orb Animation */}
        <div className="relative w-64 h-64">
          {/* Outer glow */}
          <div 
            className={`absolute inset-0 rounded-full bg-gradient-to-r ${colors.primary} filter blur-xl opacity-40 transition-all duration-300`}
            style={{ 
              transform: `scale(${isRecording ? 1.2 : 1.1})`,
              animation: isRecording ? "pulse 2s infinite ease-in-out" : "none"
            }}
          ></div>
          
          {/* Particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i}
                className={`absolute w-2 h-2 rounded-full ${colors.glow} opacity-60`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${2 + Math.random() * 3}s infinite linear`,
                  animationDelay: `${Math.random() * 2}s`,
                  transform: `scale(${Math.random() * 0.5 + 0.5})`,
                }}
              ></div>
            ))}
          </div>
          
          {/* Center orb */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              {/* Background circles */}
              <circle 
                cx="50" 
                cy="50" 
                r="32" 
                className="fill-gray-900 opacity-80"
              />
              
              {/* Dynamic wave */}
              <path
                d={`M ${wavePoints.map((p, i) => `${i === 0 ? "" : "L "}${p.x} ${p.y}`).join(" ")} Z`}
                className={`${colors.wave} fill-none stroke-2 opacity-70`}
                style={{ 
                  filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))",
                  strokeWidth: "1.5",
                  strokeLinecap: "round"
                }}
              />
              
              {/* Inner glow */}
              <circle 
                cx="50" 
                cy="50" 
                r="24" 
                className={`fill-transparent stroke-2 ${colors.wave} opacity-30`}
                style={{ 
                  filter: "drop-shadow(0 0 5px rgba(59, 130, 246, 0.8))",
                  strokeWidth: "6",
                  strokeDasharray: "150",
                  strokeDashoffset: rotation,
                  transformOrigin: "center",
                  transform: `rotate(${rotation}deg) scale(${pulseSize/100})` 
                }}
              />
              
              {/* Core orb */}
              <circle 
                cx="50" 
                cy="50" 
                r="18" 
                className={`fill-gray-900`}
              />
              
              <circle 
                cx="50" 
                cy="50" 
                r="16" 
                className={`fill-gradient-radial opacity-80`}
                style={{ 
                  fill: `url(#orbGradient)`,
                }}
              />
              
              {/* Gradient definitions */}
              <defs>
                <radialGradient id="orbGradient" cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
                  <stop offset="0%" className="stop-opacity-90" style={{ stopColor: "#60a5fa" }} />
                  <stop offset="100%" className="stop-opacity-80" style={{ stopColor: "#7c3aed" }} />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Voice output text - Enhanced */}
        <div className="mt-8 max-w-md bg-gray-900/90 backdrop-blur-lg rounded-2xl p-5 border border-gray-700/60 shadow-xl shadow-blue-900/20">
          <div className="flex items-center justify-center mb-2">
            <div className={`w-3 h-3 rounded-full ${isRecording ? "bg-red-500" : voiceInteractionState === "processing" ? "bg-yellow-500" : "bg-blue-500"} mr-2 ${isRecording ? "animate-pulse" : ""}`}></div>
            <p className={`${isRecording ? "text-red-400" : voiceInteractionState === "processing" ? "text-yellow-400" : "text-blue-400"} text-center font-medium`}>
              {isRecording ? "Listening..." : voiceInteractionState === "processing" ? "Processing..." : "Responding..."}
            </p>
          </div>
          
          <p className="text-white text-center text-lg font-light">
            {voiceOutput || (isRecording ? "Speak now..." : voiceInteractionState === "processing" ? "Analyzing your request..." : "Here's what I found...")}
          </p>
          
          {/* Visualization bars */}
          {isRecording && (
            <div className="flex justify-center items-end h-6 mt-3 space-x-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 bg-red-500/80 rounded-full"
                  style={{ 
                    height: `${Math.random() * 100}%`,
                    animation: `equalize 1s infinite ease-in-out`,
                    animationDelay: `${i * 0.1}s`
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>

        {/* Control buttons - Enhanced */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={cancelVoiceInteraction}
            className="px-6 py-3 bg-gray-900/80 backdrop-blur-lg rounded-full border border-gray-700/60 text-white hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-gray-900/30 hover:shadow-blue-900/20 hover:scale-105"
          >
            Cancel
          </button>
          {voiceInteractionState === "responding" && (
            <button
              onClick={() => playAudio(decodeBase64Audio(audios[audios.length - 1]))}
              className="px-6 py-3 bg-blue-600/80 backdrop-blur-lg rounded-full border border-blue-500/60 text-white hover:bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-900/30 flex items-center space-x-2 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>Replay Audio</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Global animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1.1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes float {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translate(50px, -50px) scale(0); opacity: 0; }
        }
        
        @keyframes equalize {
          0%, 100% { height: 30%; }
          50% { height: 100%; }
        }
      `}</style>
    </div>
  );
};

export default VoiceOrb;