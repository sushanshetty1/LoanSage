// utils/apiClient.js
import axios from 'axios';

const BASE_URL = 'https://api.sarvam.ai';
const API_KEY = '2a979785-790c-4056-a689-cd66e11748b6';

const commonHeaders = {
    'api-subscription-key': API_KEY,
};

// Translate text
export const translateText = async (text, sourceLang, targetLang) => {
    try {
        const response = await axios.post(`${BASE_URL}/translate`, {
            input: text,
            source_language_code: sourceLang,
            target_language_code: targetLang,
            speaker_gender: 'Female', // Default value, adjust as needed
            mode: 'formal', // Default value, adjust as needed
            model: 'mayura:v1', // Default value, adjust as needed
            enable_preprocessing: false, // Default value, adjust as needed
            output_script: 'roman', // Default value, adjust as needed
            numerals_format: 'international', // Default value, adjust as needed
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

// Analyze text
export const analyzeText = async (text) => {
    try {
        const response = await axios.post(`${BASE_URL}/text-analytics`, new URLSearchParams({
            text,
            questions: '', // Add questions if needed
        }), {
            headers: {
                ...commonHeaders,
                'Content-Type': 'application/x-www-form-urlencoded',
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
        formData.append('prompt', ''); // Add prompt if needed
        formData.append('model', 'saaras:v2'); // Default value, adjust as needed
        formData.append('with_diarization', 'false'); // Default value, adjust as needed
        formData.append('num_speakers', '1'); // Default value, adjust as needed

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
            inputs: [text],
            target_language_code: language,
            speaker: voice,
            pitch: 0, // Default value, adjust as needed
            pace: 1.65, // Default value, adjust as needed
            loudness: 1.5, // Default value, adjust as needed
            speech_sample_rate: 8000, // Default value, adjust as needed
            enable_preprocessing: false, // Default value, adjust as needed
            model: 'bulbul:v1', // Default value, adjust as needed
            eng_interpolation_wt: 0, // Default value, adjust as needed
            override_triplets: {}, // Default value, adjust as needed
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
};c