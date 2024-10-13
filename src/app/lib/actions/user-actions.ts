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
      SELECT u.usu_id_rut, u.usu_nombre, u.usu_apellido, u.usu_correo, r.rol_nombre, u.usu_estado
      FROM tb_usuario u
      JOIN tb_roles r ON u.rol_id = r.rol_id
    `);
    return result.rows;
  } finally {
    client.release();
  }
};

export const createUser = async (userData: User & { usu_pass: string }): Promise<User> => {
  const client = await pool.connect();
  try {
    const { usu_id_rut, usu_nombre, usu_apellido, usu_correo, rol_id, usu_estado, usu_pass } = userData;

    // Hash the password before inserting
    const hashedPassword = await bcrypt.hash(usu_pass, 10);

    await client.query(
      'INSERT INTO tb_usuario (usu_id_rut, usu_nombre, usu_apellido, usu_correo, rol_id, usu_estado, usu_pass) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [usu_id_rut, usu_nombre, usu_apellido, usu_correo, rol_id, usu_estado, hashedPassword]
    );

    return userData;
  } finally {
    client.release();
  }
};

export const deleteUserByRut = async (usu_id_rut: string): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM tb_usuario WHERE usu_id_rut = $1', [usu_id_rut]);

    console.log("usu_id_rut", usu_id_rut)

    // Ensure rowCount is not null and greater than 0
    return (typeof result.rowCount === 'number' && result.rowCount > 0);
  } finally {
    client.release();
  }
};

export const updateUserByRut = async (usu_id_rut: string, userData: User): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE tb_usuario SET usu_nombre = $1, usu_apellido = $2, usu_correo = $3, rol_id = $4, usu_estado = $5 WHERE usu_id_rut = $6',
      [userData.usu_nombre, userData.usu_apellido, userData.usu_correo, userData.rol_id, userData.usu_estado, usu_id_rut]
    );

    // Ensure rowCount is not null and greater than 0
    return result.rowCount !== null && result.rowCount > 0;
  } finally {
    client.release();
  }
};

export const getUserByRut = async (usu_id_rut: string): Promise<User | null> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT usu_id_rut, usu_nombre, usu_apellido, usu_correo, rol_id, usu_estado FROM tb_usuario WHERE usu_id_rut = $1',
      [usu_id_rut]
    );

    if (result.rows.length === 0) {
      return null; // Return null if no user is found
    }

    return result.rows[0]; // Return the found user
  } finally {
    client.release();
  }
};
