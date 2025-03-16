// utils/audioUtils.js
export const decodeBase64Audio = (base64Data) => {
  try {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'audio/wav' });
  } catch (error) {
    console.error('Audio decoding error:', error);
    return null;
  }
};

export const playAudio = (audioBlob) => {
  if (!audioBlob) return;

  const audioURL = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioURL);
  
  audio.play().catch(error => {
    console.error('Audio playback failed:', error);
  });

  return () => URL.revokeObjectURL(audioURL);
};

// components/TextToSpeech.js
const generateSpeech = async (text, languageCode, options = {}) => {
  // Validate input parameters
  if (!text || typeof text !== 'string') {
    console.error('Invalid text input');
    return null;
  }

  if (!languageCode || typeof languageCode !== 'string') {
    console.error('Invalid language code');
    return null;
  }

  // Default parameters with option overrides
  const requestBody = {
    inputs: [text.substring(0, 500)], // Truncate to 500 characters
    target_language_code: languageCode,
    speaker: options.speaker || 'meera',
    model: options.model || 'bulbul:v1',
    pitch: Math.min(Math.max(options.pitch || 0, -1), 1),
    pace: Math.min(Math.max(options.pace || 1, 0.3), 3),
    loudness: Math.min(Math.max(options.loudness || 1, 0), 3),
    speech_sample_rate: options.sampleRate || 22050,
    enable_preprocessing: options.preprocessing || false
  };

  try {
    const response = await fetch("/api/Sarvam/TextToSpeech", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(requestBody),
      signal: options.abortSignal
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'TTS request failed');
    }

    const data = await response.json();
    
    if (!data.audios || !Array.isArray(data.audios) || data.audios.length === 0) {
      throw new Error('Invalid audio response format');
    }

    const audioBlob = decodeBase64Audio(data.audios[0]);
    if (!audioBlob) {
      throw new Error('Failed to decode audio');
    }

    const cleanup = playAudio(audioBlob);
    return {
      audioData: data.audios[0],
      cleanup: cleanup || (() => {}),
      requestId: data.request_id
    };

  } catch (error) {
    console.error("TTS Error:", error.message);
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      console.log('TTS request was aborted');
    } else if (error.message.includes('network')) {
      console.error('Network error - check internet connection');
    }
    
    return null;
  }
};