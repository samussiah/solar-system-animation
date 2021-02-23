export default function dataMapping() {
    return {
        id_var: 'id',
        event_var: 'event',
        event_order_var: 'event_order', // zero-indexed orbit
        event_position_var: 'event_position', // angle of event focus on orbit
        start_timepoint_var: 'stdy',
        end_timepoint_var: 'endy',
        duration_var: 'duration',
    };
}
