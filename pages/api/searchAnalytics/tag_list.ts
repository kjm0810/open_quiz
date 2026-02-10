import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/utils/db';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    try {
        const rows = await db.query(
        'SELECT * FROM quiz_tag'
        );


        return res.status(200).json(rows); // ✅ 반드시 res로 응답
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'DB error' });
    }
}