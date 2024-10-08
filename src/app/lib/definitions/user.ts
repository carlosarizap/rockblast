export interface User {
    rut_usuario: string;
    nombres_usuario: string;
    apellidos_usuario: string;
    correo_usuario: string;
    nombre_roles?: string;  // Role name
    foto_perfil?: string; 
    estado_usuario?: boolean; 
    id_rol_usuario?: string; 
    pass_usuario?: string; 
  }
  