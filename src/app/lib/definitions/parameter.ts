export interface Parameter {
    par_id: string;                  // UUID of the parameter
    par_canal: string;               // Channel name
    par_a: number;                   // Numeric field for parameter 'a'
    par_b: number;                   // Numeric field for parameter 'b'
    par_c: number;                   // Numeric field for parameter 'c'
    par_d: number;                   // Numeric field for parameter 'd'
    par_a1: number;                  // Numeric field for parameter 'a1'
    par_b1: number;                  // Numeric field for parameter 'b1'
    par_temp_linear_factor: number;  // Temperature linear factor
    par_valor_campo_b: number;       // Field value 'b'
    par_valor_campo_d: number;       // Field value 'd'
    par_zero_read_digits: number;    // Zero read digits
    par_zero_read_temp: number;      // Zero read temperature
    par_offset_units: number;        // Offset units
    par_linear_gage_factor: number;  // Linear gage factor
    par_thermal_factor: number;      // Thermal factor
    par_valor_fabrica_c: number;     // Factory value 'c'
    par_valor_campo_c: number;       // Field value 'c'
    par_marca: string;               // Brand name
    par_num_serie: string;           // Serial number
    par_elevation_borehole: number;  // Borehole elevation
    par_depth_transducer: number;    // Depth transducer
    par_dip: number;                 // Dip angle
    par_prof_transducer: number;     // Transducer depth
    par_cota_transducer: number;     // Transducer cota (altitude)
    par_longitud_cable: string;      // Cable length
    par_rango_del_sensor: string;    // Sensor range
}
