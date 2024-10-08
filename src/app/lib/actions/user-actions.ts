// /src/app/lib/actions/user-actions.ts

import { Pool } from 'pg';
import { User } from '@/app/lib/definitions/user';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const getAllUsers = async (): Promise<User[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT u.rut_usuario, u.nombres_usuario, u.apellidos_usuario, u.correo_usuario, r.nombre_roles, u.estado_usuario
      FROM tb_usuarios u
      JOIN tb_roles r ON u.id_rol_usuario = r.id_roles
    `);
    return result.rows;
  } finally {
    client.release();
  }
};

export const createUser = async (userData: User & { pass_usuario: string }): Promise<User> => {
  const client = await pool.connect();
  try {
    const { rut_usuario, nombres_usuario, apellidos_usuario, correo_usuario, id_rol_usuario, estado_usuario, pass_usuario } = userData;

    // Hash the password before inserting
    const hashedPassword = await bcrypt.hash(pass_usuario, 10);

    await client.query(
      'INSERT INTO tb_usuarios (rut_usuario, nombres_usuario, apellidos_usuario, correo_usuario, id_rol_usuario, estado_usuario, pass_usuario) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [rut_usuario, nombres_usuario, apellidos_usuario, correo_usuario, id_rol_usuario, estado_usuario, hashedPassword]
    );

    return userData;
  } finally {
    client.release();
  }
};
