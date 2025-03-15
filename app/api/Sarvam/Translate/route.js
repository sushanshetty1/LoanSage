export async function POST(request) {
    const { input, source_language_code, target_language_code, speaker_gender, mode, model, enable_preprocessing, output_script, numerals_format } = await request.json();
  
    const url = 'https://api.sarvam.ai/translate';
    const headers = {
      'Content-Type': 'application/json',
      'API-Subscription-Key': process.env.SARVAM_API_KEY,
    };
  
    const payload = {
      input,
      source_language_code,
      target_language_code,
      speaker_gender,
      mode,
      model,
      enable_preprocessing,
      output_script,
      numerals_format,
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