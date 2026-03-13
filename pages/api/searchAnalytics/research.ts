import type { NextApiRequest, NextApiResponse } from 'next'
import db from '@/utils/db'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    // CORS 허용
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    try {
        const rows = await db.query(
            'INSERT INTO research (id) VALUES ($1)',
            [req.body.id]
        )

        return res.status(200).json(rows)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'DB error' })
    }
}