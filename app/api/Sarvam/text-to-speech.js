import { textToSpeech } from '../../utils/apiClient';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { text, language, voice } = req.body;

        try {
            const result = await textToSpeech(text, language, voice);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Failed to convert text to speech' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}