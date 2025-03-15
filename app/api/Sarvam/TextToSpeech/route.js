import { textToSpeech } from '../utils/apiClient';

export default function TextToSpeechPage() {
    const handleTextToSpeech = async () => {
        try {
            const audioData = await textToSpeech('Hello, how are you?', 'en', 'female');
            console.log('Audio Data:', audioData);
            // Play the audio or handle the response
        } catch (error) {
            console.error('Text to Speech failed:', error);
        }
    };

    return (
        <div>
            <button onClick={handleTextToSpeech}>Convert to Speech</button>
        </div>
    );
}