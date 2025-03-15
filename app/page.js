'use client';

import { useState } from 'react';

async function callSarvamAPI() {
  try {
    const response = await fetch('/api/Sarvam', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Hello, world!',
        model: 'bulbul:v1',
        language_code: 'hi-IN',
        with_timestamps: false,
        file: null,
        prompt: '',
        target_language_code: 'hi-IN',
        speaker: 'meera',
        speech_sample_rate: 8000,
        enable_preprocessing: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Sarvam API:', error);
    throw error;
  }
}

export default function MyComponent() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await callSarvamAPI();
      setResponse(data);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 mt-32">
      <button 
        onClick={handleClick} 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Call Sarvam API'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {response && (
        <pre className="bg-gray-100 p-2 mt-2 rounded">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
