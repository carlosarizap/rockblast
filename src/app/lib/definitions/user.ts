export interface User {
    usu_id_rut: string;
    usu_nombre: string;
    usu_apellido: string;
    usu_correo: string;
    rol_nombre?: string;  // Role name
    usu_foto_perfil?: string; 
    usu_estado?: boolean; 
    rol_id?: string; 
    usu_pass?: string; 
  }
  