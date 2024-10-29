import { Pool } from 'pg';
import { Node } from '@/app/lib/definitions/node';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

// Obtener todos los nodos
export const getAllNodes = async (): Promise<Node[]> => {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          n.nod_id, 
          n.nod_nombre, 
          n.esn_id, 
          n.nod_coord_este, 
          n.nod_coord_norte, 
          n.nod_cota, 
          e.esn_nombre AS estado_nombre
        FROM tb_nodo n
        JOIN tb_nodo_estados e ON n.esn_id = e.esn_id
      `);
      return result.rows;
    } finally {
      client.release();
    }
  };

// Obtener un nodo por ID
export const getNodeById = async (nod_id: string): Promise<Node | null> => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT nod_id, nod_nombre, esn_id, nod_coord_este, nod_coord_norte, nod_cota FROM tb_nodo WHERE nod_id = $1',
            [nod_id]
        );
        return result.rowCount && result.rowCount > 0 ? result.rows[0] : null;
    } finally {
        client.release();
    }
};

// Crear un nuevo nodo
export const createNode = async (nodeData: Node): Promise<Node> => {
    const client = await pool.connect();
    try {
        const { nod_id, nod_nombre, esn_id, nod_coord_este, nod_coord_norte, nod_cota } = nodeData;
        await client.query(
            'INSERT INTO tb_nodo (nod_id, nod_nombre, esn_id, nod_coord_este, nod_coord_norte, nod_cota) VALUES ($1, $2, $3, $4, $5, $6)',
            [nod_id, nod_nombre, esn_id, nod_coord_este, nod_coord_norte, nod_cota]
        );
        return nodeData;
    } finally {
        client.release();
    }
};

// Actualizar un nodo por ID
export const updateNodeById = async (nod_id: string, nodeData: Node): Promise<boolean> => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'UPDATE tb_nodo SET nod_nombre = $1, esn_id = $2, nod_coord_este = $3, nod_coord_norte = $4, nod_cota = $5 WHERE nod_id = $6',
            [nodeData.nod_nombre, nodeData.esn_id, nodeData.nod_coord_este, nodeData.nod_coord_norte, nodeData.nod_cota, nod_id]
        );
        return result.rowCount ? result.rowCount > 0 : false;
    } finally {
        client.release();
    }
};

// Eliminar un nodo por ID
export const deleteNodeById = async (nod_id: string): Promise<boolean> => {
    const client = await pool.connect();
    try {
        const result = await client.query('DELETE FROM tb_nodo WHERE nod_id = $1', [nod_id]);
        return result.rowCount ? result.rowCount > 0 : false;
    } finally {
        client.release();
    }
};
