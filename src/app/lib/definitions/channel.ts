// src/app/lib/definitions/channel.ts
export interface Channel {
    can_id: string;                     // UUID of the channel
    can_nombre: string;                 // Channel name (e.g., 'ED-176 (CH-1)')
    esc_id: string;                     // UUID of the related station
    par_id: string;                     // UUID of the associated parameter
    nod_id: string;                     // UUID of the associated node
    nodo_nombre?: string;               // Name of the associated node
    estado_nombre?: string;             // Name of the channel's status
  
    // Additional fields from tb_parametro
    par_marca?: string;                 // Brand of the parameter
    par_num_serie?: string;             // Serial number of the parameter
    par_elevation_borehole?: number;    // Elevation of the borehole
    par_depth_transducer?: number;      // Depth of the transducer
    par_cota_transducer?: number;       // Cota of the transducer
    par_longitud_cable?: string;        // Cable length
    par_rango_del_sensor?: string;      // Sensor range
    par_dip?: number;                   // Dip of the sensor
  }
  