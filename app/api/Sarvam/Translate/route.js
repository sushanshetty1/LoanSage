import { translateText } from '../utils/apiClient';

export default function TranslatePage() {
    const handleTranslate = async () => {
        try {
            const translatedText = await translateText('Hello', 'en', 'hi');
            console.log('Translated Text:', translatedText);
        } catch (error) {
            console.error('Translation failed:', error);
        }
    };

    return (
        <div>
            <button onClick={handleTranslate}>Translate</button>
        </div>
    );
}