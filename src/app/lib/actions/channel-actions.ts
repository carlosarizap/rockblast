import { Pool } from 'pg';
import { Channel } from '@/app/lib/definitions/channel';
import { Parameter } from '@/app/lib/definitions/parameter';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Obtener todos los canales con el nombre del nodo y el nombre del estado de canal
export const getAllChannels = async (): Promise<Channel[]> => {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          c.can_id, 
          c.can_nombre, 
          c.esc_id, 
          c.par_id, 
          c.nod_id, 
          n.nod_nombre AS nodo_nombre,
          e.esc_nombre AS estado_nombre,
          p.par_marca,
          p.par_num_serie,
          p.par_elevation_borehole,
          p.par_depth_transducer,
          p.par_cota_transducer,
          p.par_longitud_cable,
          p.par_rango_del_sensor,
          p.par_dip
        FROM tb_canal c
        JOIN tb_nodo n ON c.nod_id = n.nod_id
        JOIN tb_canal_estados e ON c.esc_id = e.esc_id
        JOIN tb_parametros_sensor p ON c.par_id = p.par_id
      `);
      return result.rows;
    } finally {
      client.release();
    }
  };
  
  
  // Obtener un canal por ID con el nombre del nodo y el nombre del estado de canal
  export const getChannelById = async (can_id: string): Promise<Channel | null> => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `
        SELECT 
          c.can_id, 
          c.can_nombre, 
          c.esc_id, 
          c.par_id, 
          c.nod_id, 
          n.nod_nombre AS nodo_nombre,
          e.esc_nombre AS estado_nombre
        FROM tb_canal c
        JOIN tb_nodo n ON c.nod_id = n.nod_id
        JOIN tb_canal_estados e ON c.esc_id = e.esc_id
        WHERE c.can_id = $1
        `,
        [can_id]
      );
      return result.rowCount && result.rowCount > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  };
  

// Actualizar un canal por ID
export const updateChannelById = async (can_id: string, channelData: Channel): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE tb_canal SET can_nombre = $1, esc_id = $2, par_id = $3, nod_id = $4 WHERE can_id = $5',
      [channelData.can_nombre, channelData.esc_id, channelData.par_id, channelData.nod_id, can_id]
    );
    return result.rowCount ? result.rowCount > 0 : false;
  } finally {
    client.release();
  }
};

// Eliminar un canal por ID
export const deleteChannelById = async (can_id: string): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM tb_canal WHERE can_id = $1', [can_id]);
    return result.rowCount ? result.rowCount > 0 : false;
  } finally {
    client.release();
  }
};

// Crear un nuevo canal y sus parámetros
export const createChannelWithParams = async (channelData: Channel, parameterData: Parameter): Promise<Channel> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Iniciar una transacción

    // Insertar el canal
    const channelResult = await client.query(
      'INSERT INTO tb_canal (can_id, can_nombre, esc_id, par_id, nod_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [channelData.can_id, channelData.can_nombre, channelData.esc_id, channelData.par_id, channelData.nod_id]
    );
    const newChannel = channelResult.rows[0];

    // Insertar los parámetros
    await client.query(
      `INSERT INTO tb_parametro (
        par_id, par_canal, par_a, par_b, par_c, par_d, par_a1, par_b1,
        par_temp_linear_factor, par_valor_campo_b, par_valor_campo_d, par_zero_read_digits, par_zero_read_temp,
        par_offset_units, par_linear_gage_factor, par_thermal_factor, par_valor_fabrica_c, par_valor_campo_c,
        par_marca, par_num_serie, par_elevation_borehole, par_depth_transducer, par_dip, par_prof_transducer,
        par_cota_transducer, par_longitud_cable, par_rango_del_sensor
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)`,
      [
        parameterData.par_id, parameterData.par_canal, parameterData.par_a, parameterData.par_b, parameterData.par_c,
        parameterData.par_d, parameterData.par_a1, parameterData.par_b1, parameterData.par_temp_linear_factor,
        parameterData.par_valor_campo_b, parameterData.par_valor_campo_d, parameterData.par_zero_read_digits,
        parameterData.par_zero_read_temp, parameterData.par_offset_units, parameterData.par_linear_gage_factor,
        parameterData.par_thermal_factor, parameterData.par_valor_fabrica_c, parameterData.par_valor_campo_c,
        parameterData.par_marca, parameterData.par_num_serie, parameterData.par_elevation_borehole,
        parameterData.par_depth_transducer, parameterData.par_dip, parameterData.par_prof_transducer,
        parameterData.par_cota_transducer, parameterData.par_longitud_cable, parameterData.par_rango_del_sensor
      ]
    );

    await client.query('COMMIT'); // Confirmar la transacción
    return newChannel;
  } catch (error) {
    await client.query('ROLLBACK'); // Revertir la transacción en caso de error
    console.error('Error creating channel and parameters:', error);
    throw new Error('Failed to create channel with parameters');
  } finally {
    client.release();
  }
};
