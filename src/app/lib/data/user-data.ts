import { Pool } from 'pg';
import { User } from '@/app/lib/definitions/user';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Fetch all users with role names from the database
export const getAllUsersFromDB = async (): Promise<User[]> => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT u.usu_id_rut, u.usu_nombre, u.usu_apellido, u.usu_correo, r.rol_nombre, u.usu_estado
      FROM tb_usuario u
      JOIN tb_roles r ON u.rol_id = r.rol_id
    `;
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
};

// Fetch a single user by ID
export const getUserByIdFromDB = async (id: string): Promise<User | null> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM tb_usuario WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0];
  } finally {
    client.release();
  }
};
