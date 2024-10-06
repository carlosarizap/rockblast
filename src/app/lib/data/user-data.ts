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
      SELECT u.rut_usuario, u.nombres_usuario, u.apellidos_usuario, u.correo_usuario, r.nombre_roles, u.estado_usuario
      FROM tb_usuarios u
      JOIN tb_roles r ON u.id_rol_usuario = r.id_roles
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
    const result = await client.query('SELECT * FROM tb_usuarios WHERE id = $1', [id]);

    console.log("resilt", result);

    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0];
  } finally {
    client.release();
  }
};
