export default function defineEventTypes() {
    const eventTypes = Array.from(new Set(this.data.map((d) => d.event_order + ':|:' + d.event)))
        .map((eventType) => {
            const split = eventType.split(':|:');
            return {
                order: parseInt(split[0]),
                label: split[1],
                count: 0,
            };
        })
        .sort((a, b) => (a.order - b.order ? a.order - b.order : a.label < b.label ? -1 : 1));

    // Define coordinates of foci.
    // TODO: make the coordinates a little less hard-coded, particularly the + 380 and + 365 bits
    const theta = (2 * Math.PI) / (eventTypes.length - 1);
    const centerX = this.settings.centerCoordinates.x;
    const centerY = this.settings.centerCoordinates.y;
    eventTypes.forEach((eventType, i) => {
        eventType.x = i === 0 ? centerX : (i * 100 + 50) * Math.cos(i * theta) + centerX;
        eventType.y = i === 0 ? centerY : (i * 100 + 50) * Math.sin(i * theta) + centerY;
    });

    return eventTypes;
}
