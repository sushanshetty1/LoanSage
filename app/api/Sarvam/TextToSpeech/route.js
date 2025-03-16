import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Check if API keys are configured
    if (!process.env.SARVAM_API_KEY) {
      return NextResponse.json(
        { error: "API keys not configured" },
        { status: 500 }
      );
    }

    // Parse the request body
    const { text, language = "en-IN", speaker = "default" } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Call Sarvam AI's TTS API
    const ttsResponse = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Subscription-Key": process.env.SARVAM_API_KEY,
      },
      body: JSON.stringify({
        inputs: [text], // Text to convert to speech
        target_language_code: language, // Language code (e.g., "en-IN")
        speaker: speaker, // Speaker voice (e.g., "default")
        speech_sample_rate: 22050, // Sample rate (adjust as needed)
        enable_preprocessing: true, // Enable preprocessing (adjust as needed)
        model: "bulbul:v1", // Model (adjust as needed)
      }),
    });

    if (!ttsResponse.ok) {
      throw new Error(`Text-to-Speech API error: ${ttsResponse.status}`);
    }

    const ttsData = await ttsResponse.json();
    const audioUrl = ttsData.audio_url; // Extract the audio URL from the response

    // Return the audio URL
    return NextResponse.json({ audioUrl });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate audio" },
      { status: 500 }
    );
  }
}