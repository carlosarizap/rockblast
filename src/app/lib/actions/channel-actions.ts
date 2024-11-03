import { Pool } from 'pg';
import { Channel } from '@/app/lib/definitions/channel';
import { Parameter } from '@/app/lib/definitions/parameter';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const replaceEmptyStringsWithNull = (data: { [key: string]: any }) => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
  );
};

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
// Obtener un canal por ID con el nombre del nodo y el nombre del estado de canal
export const getChannelById = async (can_id: string): Promise<(Channel & Parameter) | null> => {
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
          e.esc_nombre AS estado_nombre,
          p.par_marca,
          p.par_num_serie,
          p.par_elevation_borehole,
          p.par_depth_transducer,
          p.par_cota_transducer,
          p.par_longitud_cable,
          p.par_rango_del_sensor,
          p.par_dip,
          p.par_prof_transducer,
          p.par_a,
          p.par_b,
          p.par_c,
          p.par_d,
          p.par_a1,
          p.par_b1,
          p.par_temp_linear_factor,
          p.par_valor_campo_b,
          p.par_valor_campo_d,
          p.par_zero_read_digits,
          p.par_zero_read_temp,
          p.par_offset_units,
          p.par_linear_gage_factor,
          p.par_thermal_factor,
          p.par_valor_fabrica_c,
          p.par_valor_campo_c
        FROM tb_canal c
        JOIN tb_nodo n ON c.nod_id = n.nod_id
        JOIN tb_canal_estados e ON c.esc_id = e.esc_id
        JOIN tb_parametros_sensor p ON c.par_id = p.par_id
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

export const createChannelWithParams = async (channelData: Channel, parameterData: Parameter): Promise<Channel> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start transaction

    // Generate new UUIDs for `can_id` and `par_id` if they are empty
    const can_id = channelData.can_id || uuidv4();
    const parameterId = parameterData.par_id || uuidv4(); // Assign UUID to parameterId



    const parameterDataWithId = replaceEmptyStringsWithNull({
      ...parameterData,
      par_id: parameterId,  // Use parameterId for par_id in parameterDataWithId
      par_canal: channelData.can_nombre
    });

    const values = [
      parameterDataWithId.par_id,
      parameterDataWithId.par_canal || null,  // Handle optional string
      parameterDataWithId.par_a ?? null,      // Handle numeric values directly
      parameterDataWithId.par_b ?? null,
      parameterDataWithId.par_c ?? null,
      parameterDataWithId.par_d ?? null,
      parameterDataWithId.par_a1 ?? null,
      parameterDataWithId.par_b1 ?? null,
      parameterDataWithId.par_temp_linear_factor ?? null,
      parameterDataWithId.par_valor_campo_b ?? null,
      parameterDataWithId.par_valor_campo_d ?? null,
      parameterDataWithId.par_zero_read_digits ?? null,
      parameterDataWithId.par_zero_read_temp ?? null,
      parameterDataWithId.par_offset_units ?? null,
      parameterDataWithId.par_linear_gage_factor ?? null,
      parameterDataWithId.par_valor_fabrica_c ?? null,
      parameterDataWithId.par_valor_campo_c ?? null,
      parameterDataWithId.par_marca || null,
      parameterDataWithId.par_num_serie || null,
      parameterDataWithId.par_elevation_borehole ?? null,
      parameterDataWithId.par_depth_transducer ?? null,
      parameterDataWithId.par_dip ?? null,
      parameterDataWithId.par_prof_transducer ?? null,
      parameterDataWithId.par_cota_transducer ?? null,
      parameterDataWithId.par_longitud_cable || null,
      parameterDataWithId.par_rango_del_sensor || null,
      parameterDataWithId.par_thermal_factor ?? null
    ];

    await client.query(
      `INSERT INTO tb_parametros_sensor (
        par_id, par_canal, par_a, par_b, par_c, par_d, par_a1, par_b1,
        par_temp_linear_factor, par_valor_campo_b, par_valor_campo_d, par_zero_read_digits, par_zero_read_temp,
        par_offset_units, par_linear_gage_factor, par_valor_fabrica_c, par_valor_campo_c,
        par_marca, par_num_serie, par_elevation_borehole, par_depth_transducer, par_dip, par_prof_transducer,
        par_cota_transducer, par_longitud_cable, par_rango_del_sensor, par_thermal_factor
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)`,
      values
    );

    // Insert the channel now that `par_id` exists in `tb_parametros_sensor`
    const channelResult = await client.query(
      'INSERT INTO tb_canal (can_id, can_nombre, esc_id, par_id, nod_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [can_id, channelData.can_nombre, channelData.esc_id, parameterId, channelData.nod_id] // Use parameterId for `par_id`
    );

    const newChannel = channelResult.rows[0];
    await client.query('COMMIT'); // Commit transaction
    return newChannel;

  } catch (error) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    console.error('Error creating channel and parameters:', error);
    throw new Error('Failed to create channel with parameters');
  } finally {
    client.release();
  }
};
export const updateChannelWithParams = async (can_id: string, channelData: Channel, parameterData: Parameter): Promise<boolean> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start transaction

    // Retrieve `par_id` if it's not provided in `parameterData`
    const parameterId = parameterData.par_id || (await client.query('SELECT par_id FROM tb_canal WHERE can_id = $1', [can_id])).rows[0]?.par_id;
    
    if (!parameterId) {
      throw new Error(`Parameter ID (par_id) not found for channel with ID ${can_id}`);
    }

    const parameterDataWithId = replaceEmptyStringsWithNull({
      ...parameterData,
      par_id: parameterId,
      par_canal: channelData.can_nombre
    });
    // Update the parameter in tb_parametros_sensor
    await client.query(
      `UPDATE tb_parametros_sensor SET 
        par_canal = $1, par_a = $2, par_b = $3, par_c = $4, par_d = $5, par_a1 = $6, par_b1 = $7,
        par_temp_linear_factor = $8, par_valor_campo_b = $9, par_valor_campo_d = $10, par_zero_read_digits = $11, 
        par_zero_read_temp = $12, par_offset_units = $13, par_linear_gage_factor = $14, par_valor_fabrica_c = $15, 
        par_valor_campo_c = $16, par_marca = $17, par_num_serie = $18, par_elevation_borehole = $19, 
        par_depth_transducer = $20, par_dip = $21, par_prof_transducer = $22, par_cota_transducer = $23, 
        par_longitud_cable = $24, par_rango_del_sensor = $25, par_thermal_factor = $26
      WHERE par_id = $27`,
      [
        parameterDataWithId.par_canal, parameterDataWithId.par_a, parameterDataWithId.par_b,
        parameterDataWithId.par_c, parameterDataWithId.par_d, parameterDataWithId.par_a1, parameterDataWithId.par_b1,
        parameterDataWithId.par_temp_linear_factor, parameterDataWithId.par_valor_campo_b, parameterDataWithId.par_valor_campo_d,
        parameterDataWithId.par_zero_read_digits, parameterDataWithId.par_zero_read_temp, parameterDataWithId.par_offset_units,
        parameterDataWithId.par_linear_gage_factor, parameterDataWithId.par_valor_fabrica_c, parameterDataWithId.par_valor_campo_c,
        parameterDataWithId.par_marca, parameterDataWithId.par_num_serie, parameterDataWithId.par_elevation_borehole,
        parameterDataWithId.par_depth_transducer, parameterDataWithId.par_dip, parameterDataWithId.par_prof_transducer,
        parameterDataWithId.par_cota_transducer, parameterDataWithId.par_longitud_cable, parameterDataWithId.par_rango_del_sensor,
        parameterDataWithId.par_thermal_factor, parameterId
      ]
    );

    // Update the channel in tb_canal
    const result = await client.query(
      'UPDATE tb_canal SET can_nombre = $1, esc_id = $2, par_id = $3, nod_id = $4 WHERE can_id = $5',
      [channelData.can_nombre, channelData.esc_id, parameterId, channelData.nod_id, can_id]
    );

    await client.query('COMMIT'); // Commit transaction
    return result.rowCount ? result.rowCount > 0 : false;
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    console.error('Error updating channel and parameters:', error);
    throw new Error('Failed to update channel with parameters');
  } finally {
    client.release();
  }
};



export const deleteChannelWithParams = async (can_id: string): Promise<boolean> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start transaction

    // Delete the channel first to remove the foreign key constraint
    const channelDeleteResult = await client.query('DELETE FROM tb_canal WHERE can_id = $1 RETURNING par_id', [can_id]);

    if (channelDeleteResult.rowCount === 0) {
      // If no channel was deleted, rollback and return false
      await client.query('ROLLBACK');
      return false;
    }

    // Retrieve the `par_id` to delete the associated parameter
    const par_id = channelDeleteResult.rows[0].par_id;

    // Delete the associated parameter
    const parameterDeleteResult = await client.query('DELETE FROM tb_parametros_sensor WHERE par_id = $1', [par_id]);

    await client.query('COMMIT'); // Commit transaction
    return parameterDeleteResult.rowCount ? parameterDeleteResult.rowCount > 0 : false;
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    console.error('Error deleting channel and parameters:', error);
    throw new Error('Failed to delete channel with parameters');
  } finally {
    client.release();
  }
};




