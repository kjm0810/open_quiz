import type { NextApiRequest, NextApiResponse } from "next";
import db from '@/utils/db';

/**
 * 외부 Express API(`/api/quiz/add`) 대신 사용하는 내부 API
 * 클라이언트에서 이미 Blob URL을 만들어온 JSON payload를 저장만 합니다.
 */
export default async function Quiz_add(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const {
      title,
      description,
      user_id,
      tag_id,
      thumbnail_url,
      quiz_content,
    } = req.body;

    if (!quiz_content || !Array.isArray(quiz_content) || quiz_content.length === 0) {
      return res.status(400).json({ error: "invalid_answer" });
    }

    // quiz_list INSERT
    const quizListRows = await db.query(
      `
      INSERT INTO quiz_list
      (title, description, user_id, tag_id, thumbnail_img_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING quiz_id
      `,
      [
        title,
        description,
        user_id,
        tag_id,
        thumbnail_url,
      ]
    );

    const insertId = quizListRows[0]?.quiz_id;

    // quiz_content INSERT
    for (let index = 0; index < quiz_content.length; index++) {
      const item = quiz_content[index];

      await db.query(
        `
        INSERT INTO quiz_content
        (quiz_id, content, type, answer1, answer2, answer3, answer4, answer5, content_img_url, answer_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
        [
          insertId,
          item.content,
          item.type,
          item.answer1,
          item.answer2,
          item.answer3,
          item.answer4,
          item.answer5,
          item.content_img_url,
          item.answer_number,
        ]
      );
    }

    return res.status(200).json({
      success: true,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "DB insert failed" });
  }
}
