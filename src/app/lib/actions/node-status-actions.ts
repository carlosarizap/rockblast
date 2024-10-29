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
      SELECT esn_id, esn_nombre
      FROM tb_nodo_estados
      ORDER BY esn_nombre ASC
    `);
    return result.rows;
  } finally {
    client.release();
  }
};
