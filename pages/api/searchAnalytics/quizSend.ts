import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/utils/db';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    try {
        const [rows] = await db.query(
            'INSERT INTO quiz_result (adjust_percent, isLogin, login_user_id, quiz_id) VALUES (?, ?, ?, ?)',
            [req.body.adjust_percent, req.body.isLogin, req.body.login_user_id, req.body.quiz_id]
        );

        return res.status(200).json(rows); // ✅ 반드시 res로 응답
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'DB error' });
    }
}