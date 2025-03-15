import { speechToTextTranslate } from '../../utils/apiClient';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { audioFile, sourceLang, targetLang } = req.body;

        try {
            const result = await speechToTextTranslate(audioFile, sourceLang, targetLang);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Failed to convert speech to text and translate' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}