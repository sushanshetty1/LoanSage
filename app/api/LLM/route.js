import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { prompt, language } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const formattedPrompt = `You are a helpful financial assistant. Provide useful information about ${prompt} in ${language}. Include relevant financial concepts, considerations, and general guidance.`;

    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 800,
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: formattedPrompt }] }],
      generationConfig,
    });

    const textOutput = result.response.text();
    return NextResponse.json({ output: textOutput });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate financial information" }, { status: 500 });
  }
}