export default function event() {
    const nest = d3.nest()
        .key(d => d.event)
        .rollup(group => {
            const event = group[0];
            const order = parseInt(event.event_order);

            return {
                order,
                count: 0,
                prevCount: 0,
            };
        })
        .entries(this.data);


    // Calculate coordinates of event focus.
    const centerX = this.settings.width/2;
    const centerY = this.settings.height/2;
    const theta = (2 * Math.PI) / (nest.length - 1);

    nest.forEach((event,i) => {
        Object.assign(event, event.value);
        event.value = event.key;
        delete event.key;
        event.x = event.order === 0 ? centerX : (event.order * 100 + 50) * Math.cos(i * theta) + centerX;
        event.y = event.order === 0 ? centerY : (event.order * 100 + 50) * Math.sin(i * theta) + centerY;
    });

    // Ensure events plot in order.
    nest.sort((a,b) => a.order - b.order);

    return nest;
}
