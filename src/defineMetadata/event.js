export default function event() {
    const theta = (2 * Math.PI) / (this.metadata.event.length - 2);
    const centerX = this.settings.centerCoordinates.x;
    const centerY = this.settings.centerCoordinates.y;

    this.metadata.event.forEach((event, i) => {
        event.order = parseInt(this.data.find((d) => d.event === event.value).event_order);
        event.count = 0;
        event.prevCount = 0;
        event.x = event.order === 0 ? centerX : (event.order * 100 + 50) * Math.cos(i * theta) + centerX;
        event.y = event.order === 0 ? centerY : (event.order * 100 + 50) * Math.sin(i * theta) + centerY;
    });
}
