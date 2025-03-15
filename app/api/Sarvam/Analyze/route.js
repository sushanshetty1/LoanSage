import { analyzeText } from '../utils/apiClient';

export default function AnalyzeTextPage() {
    const handleAnalyze = async () => {
        try {
            const analysisResult = await analyzeText('Climate change is a critical global challenge.');
            console.log('Analysis Result:', analysisResult);
        } catch (error) {
            console.error('Text analysis failed:', error);
        }
    };

    return (
        <div>
            <button onClick={handleAnalyze}>Analyze Text</button>
        </div>
    );
}