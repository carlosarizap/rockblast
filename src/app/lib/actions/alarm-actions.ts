import { Pool } from 'pg';
import { Alarm } from '@/app/lib/definitions/alarm';
import { v4 as uuidv4 } from 'uuid'; // Para generar un nuevo ale_id

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

// Obtener todas las alarmas
export const getAllAlarms = async (): Promise<Alarm[]> => {
    const client = await pool.connect();
    try {
        const result = await client.query(`
                SELECT 
    a.ale_id, 
    a.cal_id, 
    a.usu_id_rut, 
    u.usu_nombre AS usu_nombre, -- Include user name from tb_usuario
    u.usu_apellido AS usu_apellido, -- Optionally include user last name
    a.tal_id, 
    t.tal_nombre AS tipo_alerta, -- Join with tb_tipo_alerta to get the alert type name
    a.ale_description, 
    a.ale_fecha, 
    a.ale_revision 
FROM tb_alerta a
LEFT JOIN tb_tipo_alerta t ON a.tal_id = t.tal_id -- Join with tb_tipo_alerta for alert type
LEFT JOIN tb_usuario u ON a.usu_id_rut = u.usu_id_rut -- Join with tb_usuario to get user details
ORDER BY a.ale_fecha DESC; -- Order results by ale_revision in descending order

        `);
        return result.rows;
    } finally {
        client.release();
    }
};


// Obtener una alarma por ID
export const getAlarmById = async (ale_id: string): Promise<Alarm | null> => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT ale_id, cal_id, usu_id_rut, tal_id, ale_description, ale_fecha, ale_revision FROM tb_alerta WHERE ale_id = $1',
            [ale_id]
        );
        return (result.rowCount ?? 0) > 0 ? result.rows[0] : null;
    } finally {
        client.release();
    }
};

// Crear una nueva alarma
export const createAlarm = async (alarmData: Omit<Alarm, 'ale_id'>): Promise<Alarm> => {
    const client = await pool.connect();
    try {
        const ale_id = uuidv4(); // Genera un nuevo UUID para ale_id
        const { cal_id, usu_id_rut, tal_id, ale_description, ale_fecha, ale_revision } = alarmData;

        await client.query(
            'INSERT INTO tb_alerta (ale_id, cal_id, usu_id_rut, tal_id, ale_description, ale_fecha, ale_revision) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [ale_id, cal_id, usu_id_rut, tal_id, ale_description, ale_fecha, ale_revision]
        );

        return { ale_id, ...alarmData }; // Retorna la alarma creada con el ID generado
    } finally {
        client.release();
    }
};

// Actualizar una alarma por ID
export const updateAlarmById = async (ale_id: string, alarmData: Partial<Alarm>): Promise<boolean> => {
    const client = await pool.connect();
    try {
        // Add user ID and date fields to the update
        const fields = Object.keys(alarmData)
            .map((key, index) => `${key} = $${index + 2}`)
            .join(", ");
        const values = Object.values(alarmData);

        const result = await client.query(
            `UPDATE tb_alerta SET ${fields} WHERE ale_id = $1`,
            [ale_id, ...values]
        );

        return (result.rowCount ?? 0) > 0;
    } finally {
        client.release();
    }
};


// Eliminar una alarma por ID
export const deleteAlarmById = async (ale_id: string): Promise<boolean> => {
    const client = await pool.connect();
    try {
        const result = await client.query('DELETE FROM tb_alerta WHERE ale_id = $1', [ale_id]);
        return (result.rowCount ?? 0) > 0;

    } finally {
        client.release();
    }
};
