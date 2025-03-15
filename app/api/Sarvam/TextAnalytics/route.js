// api/Sarvam/TextAnalytics/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
    const { text, questions } = await request.formData();
  
    const url = 'https://api.sarvam.ai/text-analytics';
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'API-Subscription-Key': process.env.SARVAM_API_KEY,
    };
  
    const formData = new URLSearchParams();
    formData.append('text', text);
    formData.append('questions', questions);
  
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