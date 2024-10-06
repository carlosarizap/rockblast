import { Pool } from 'pg';
import { User } from '@/app/lib/definitions/user';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Fetch all users from the database
export const getAllUsersFromDB = async (): Promise<User[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM tb_usuarios');
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

    console.log("resilt",result)

    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0];
  } finally {
    client.release();
  }
};
