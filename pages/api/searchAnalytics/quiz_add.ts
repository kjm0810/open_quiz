import type { NextApiRequest, NextApiResponse } from "next";
import db from '@/utils/db';
import formidable from "formidable";
import sharp from "sharp";
import { put } from "@vercel/blob";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function Quiz_add(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const form = formidable({
    multiples: false,
    keepExtensions: true,
  });

  try {
    const { fields, files } = await new Promise<any>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    if (!fields?.quiz_content || fields.quiz_content.length === 0) {
      return res.status(400).json({ error: "invalid_answer" });
    }

    /* ===============================
       썸네일 이미지 → Vercel Blob
    =============================== */
    let thumbnailUrl: string | null = null;
    const thumbFile = files.thumbnail_image?.[0];

    if (thumbFile) {
      const buffer = await sharp(thumbFile.filepath)
        .resize({ width: 720 })
        .webp({ quality: 80 })
        .toBuffer();

      const blob = await put(
        `quiz/thumbnails/${Date.now()}.webp`,
        buffer,
        { access: "public" }
      );

      thumbnailUrl = blob.url;
    }

    /* ===============================
       quiz_list INSERT
    =============================== */
    const [insertResult]: any = await db.query(
      `
      INSERT INTO quiz_list
      (title, description, user_id, tag_id, thumbnail_img_url)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        fields.title,
        fields.description,
        fields.user_id,
        fields.tag_id,
        thumbnailUrl,
      ]
    );

    const insertId = insertResult.insertId;
    const quizContent = JSON.parse(fields.quiz_content[0]);

    /* ===============================
       콘텐츠 이미지 → Vercel Blob
    =============================== */
    for (let index = 0; index < quizContent.length; index++) {
      const item = quizContent[index];
      let contentImgUrl: string | null = null;

      const contentFile = files[`content_img_${index}`]?.[0];
      if (contentFile) {
        const buffer = await sharp(contentFile.filepath)
          .resize({ width: 720 })
          .webp({ quality: 80 })
          .toBuffer();

        const blob = await put(
          `quiz/contents/${insertId}_${index}.webp`,
          buffer,
          { access: "public" }
        );

        contentImgUrl = blob.url;
      }

      await db.query(
        `
        INSERT INTO quiz_content
        (quiz_id, content, type, answer1, answer2, answer3, answer4, answer5, content_img_url, answer_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          contentImgUrl,
          item.answer_number,
        ]
      );
    }

    return res.status(200).json({
      success: true,
      thumbnail: thumbnailUrl,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Image processing failed" });
  }
}
