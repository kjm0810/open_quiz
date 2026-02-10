import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
});

/**
 * pg 호환 래퍼
 * 기존 mysql2/promise의 `const [rows] = await db.query(...)` 패턴을
 * 최대한 유지하기 위해 rows 배열만 반환합니다.
 */
const db = {
    query: async (text: string, params?: any[]) => {
        const result = await pool.query(text, params);
        return result.rows;
    },
};

export default db;