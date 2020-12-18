export default function event() {
    const nest = d3
        .nest()
        .key((d) => d.event)
        .rollup((group) => {
            const event = group[0];
            const order = parseInt(event.event_order);
            const position = event.hasOwnProperty('event_position')
                ? parseInt(event.event_position)
                : null;

            return {
                order,
                position,
                count: 0,
                prevCount: 0,
                cumulative: 0,
                cumulativeIds: new Set(),
                nEvents: group.length,
            };
        })
        .entries(this.data);

    nest.forEach((event) => {
        Object.assign(event, event.value);
        event.value = event.key;
        delete event.key;
    });

    // Define position of event focus along orbit.
    d3.nest()
        .key((d) => d.order)
        .rollup((group) => {
            const n = group.length;
            const range = d3.range(-45, 46);
            group.forEach((d, i) => {
                d.position =
                    d.position === null ? d3.quantile(range, (i + 1) / (n + 1)) : d.position;
            });
        })
        .entries(nest);

    // Ensure events plot in order.
    nest.sort((a, b) => a.order - b.order || b.nEvents - a.nEvents);

    return nest;
}
