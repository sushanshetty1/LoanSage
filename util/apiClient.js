// utils/apiClient.js
import axios from 'axios';

const BASE_URL = 'https://api.sarvam.ai'; // Replace with the actual base URL if different
const API_KEY = 'your-api-key-here'; // Replace with your actual API key

// Common headers with API key
const commonHeaders = {
    'api-subscription-key': API_KEY,
};

// Analyze Text
export const analyzeText = async (text) => {
    try {
        const response = await axios.post(`${BASE_URL}/text-analytics`, {
            text,
        }, {
            headers: {
                ...commonHeaders,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error analyzing text:', error);
        throw error;
    }
};

// Speech to Text Translate
export const speechToTextTranslate = async (audioFile, sourceLang, targetLang) => {
    try {
        const formData = new FormData();
        formData.append('file', audioFile);
        formData.append('source_language', sourceLang);
        formData.append('target_language', targetLang);

        const response = await axios.post(`${BASE_URL}/speech-to-text-translate`, formData, {
            headers: {
                ...commonHeaders,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error converting speech to text and translating:', error);
        throw error;
    }
};

// Text to Speech
export const textToSpeech = async (text, language, voice) => {
    try {
        const response = await axios.post(`${BASE_URL}/text-to-speech`, {
            text,
            language,
            voice,
        }, {
            headers: {
                ...commonHeaders,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error converting text to speech:', error);
        throw error;
    }
};

// Translate Text
export const translateText = async (text, sourceLang, targetLang) => {
    try {
        const response = await axios.post(`${BASE_URL}/translate`, {
            text,
            source_language: sourceLang,
            target_language: targetLang,
        }, {
            headers: {
                ...commonHeaders,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error translating text:', error);
        throw error;
    }
};