import { translateText } from '../../utils/apiClient';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { text, sourceLang, targetLang } = req.body;

        try {
            const result = await translateText(text, sourceLang, targetLang);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Failed to translate text' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}