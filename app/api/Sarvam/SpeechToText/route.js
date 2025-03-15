//api/Sarvam/SpeechToText/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
    const { file, prompt, model, with_diarization, num_speakers } = await request.formData();
  
    const url = 'https://api.sarvam.ai/speech-to-text-translate';
    const headers = {
      'API-Subscription-Key': process.env.SARVAM_API_KEY,
    };
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', prompt);
    formData.append('model', model);
    formData.append('with_diarization', with_diarization);
    formData.append('num_speakers', num_speakers);
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });
  
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }