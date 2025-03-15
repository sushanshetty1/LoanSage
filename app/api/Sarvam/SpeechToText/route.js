import { speechToTextTranslate } from '../utils/apiClient';

export default function SpeechToTextPage() {
    const handleSpeechToText = async (audioFile) => {
        try {
            const result = await speechToTextTranslate(audioFile, 'en', 'hi');
            console.log('Speech to Text Result:', result);
        } catch (error) {
            console.error('Speech to Text failed:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={(e) => handleSpeechToText(e.target.files[0])} />
        </div>
    );
}