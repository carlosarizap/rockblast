export interface Channel {
    can_id: string;       // UUID of the channel
    can_nombre: string;   // Channel name (e.g., 'ED-176 (CH-1)')
    esc_id: string;       // UUID of the related station
    par_id: string;       // UUID of the associated parameter
    nod_id: string;       // UUID of the associated node
}
