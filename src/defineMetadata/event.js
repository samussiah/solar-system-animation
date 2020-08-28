export default function event() {
    const nest = d3
        .nest()
        .key((d) => d.event)
        .rollup((group) => {
            const event = group[0];
            const order = parseInt(event.event_order);

            return {
                order,
                count: 0,
                prevCount: 0,
                cumulative: 0,
                nEvents: group.length
            };
        })
        .entries(this.data);

    nest.forEach((event) => {
        Object.assign(event, event.value);
        event.value = event.key;
        delete event.key;
    });

    // Ensure events plot in order.
    nest.sort((a, b) => a.order - b.order || b.nEvents - a.nEvents);

    return nest;
}
