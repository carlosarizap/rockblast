// /src/app/api/roles/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id_roles, nombre_roles FROM tb_roles');
    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ message: 'Error fetching roles' }, { status: 500 });
  }
}
