import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/utils/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const tagId = Number(req.query.tag_id ?? 0);

    let sql = 'SELECT * FROM quiz_list';
    const params: any[] = [];

    if (tagId !== 0) {
      sql += ' WHERE tag_id = $1';
      params.push(tagId);
    }

    sql += ' ORDER BY quiz_id DESC';

    const rows = await db.query(sql, params);

    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'DB error' });
  }
}
