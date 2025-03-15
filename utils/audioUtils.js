export const decodeBase64Audio = (base64String) => {
    try {
      const binaryString = atob(base64String); // Decode base64
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new Blob([bytes], { type: "audio/mp3" }); // Create a Blob
    } catch (error) {
      console.error("Error decoding base64 audio:", error);
      return null;
    }
  };
  
  export const playAudio = (audioBlob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  };