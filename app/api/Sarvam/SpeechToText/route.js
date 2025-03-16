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