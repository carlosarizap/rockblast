import { Pool } from 'pg';
import { unstable_noStore as noStore } from 'next/cache';
import { Node } from '@/app/lib/definitions/node';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Obtener todos los nodos que coincidan con una búsqueda
export async function fetchNodesByQuery(query: string): Promise<Node[]> {
  noStore();
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT
        nod_id,
        nod_nombre,
        esn_id,
        nod_coord_este,
        nod_coord_norte,
        nod_cota
      FROM tb_nodo
      WHERE
        nod_nombre ILIKE $1 OR
        esn_id ILIKE $1
      ORDER BY nod_nombre ASC
    `, [`%${query}%`]);
    return result.rows as Node[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch nodes.');
  } finally {
    client.release();
  }
}

// Obtener un nodo por ID
export async function fetchNodeById(nod_id: string): Promise<Node | null> {
  noStore();
  if (!nod_id) return null;
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT *
      FROM tb_nodo
      WHERE nod_id = $1
    `, [nod_id]);
    return result.rows[0] as Node || null;
  } catch (error) {
    console.error('Failed to fetch node:', error);
    throw new Error('Failed to fetch node.');
  } finally {
    client.release();
  }
}

// Obtener un nodo por nombre (opcional)
export async function fetchNodeByName(nod_nombre: string): Promise<Node | null> {
  noStore();
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT *
      FROM tb_nodo
      WHERE nod_nombre ILIKE $1
    `, [`%${nod_nombre}%`]);
    return result.rows[0] as Node || null;
  } catch (error) {
    console.error('Failed to fetch node:', error);
    throw new Error('Failed to fetch node.');
  } finally {
    client.release();
  }
}
