import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export interface Status {
  esn_id: string;
  esn_nombre: string;
}

// Obtener todos los estados
export const getAllStatuses = async (): Promise<Status[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT esc_id, esc_nombre
      FROM tb_canal_estados
      ORDER BY esc_nombre ASC
    `);
    return result.rows;
  } finally {
    client.release();
  }
};
