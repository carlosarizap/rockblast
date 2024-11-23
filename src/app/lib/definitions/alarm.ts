export interface Alarm {
    ale_id: string; // Unique identifier for the alert
    cal_id: string | null; // ID of the calendar or related entity (nullable)
    usu_id_rut: string | null; // User ID or related field (nullable)
    tal_id: string; // ID of the related task or entity
    ale_description: string | null; // Description of the alert (nullable)
    ale_fecha: string | null; // Date of the alert, could be nullable if not provided
    ale_revision: string | null; // Revision or additional notes (nullable)
    tipo_alerta?: string | null; // Revision or additional notes (nullable)
    usu_nombre?: string | null; // Revision or additional notes (nullable)
    usu_apellido?: string | null; // Revision or additional notes (nullable)
}
