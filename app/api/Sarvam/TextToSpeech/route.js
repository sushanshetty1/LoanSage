import { NextResponse } from 'next/server';

export async function POST(request) {
  const { text, model, language_code, with_timestamps, file, prompt, target_language_code, speaker, speech_sample_rate, enable_preprocessing } = await request.json();

  const url = 'https://api.sarvam.ai/text-to-speech';
  const headers = {
    'Content-Type': 'application/json',
    'API-Subscription-Key': process.env.SARVAM_API_KEY,
  };

  const payload = {
    inputs: [text],
    target_language_code,
    speaker,
    speech_sample_rate,
    enable_preprocessing,
    model,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}