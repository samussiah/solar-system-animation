export default function coordinates(metadata) {
    // Dimensions of canvas.
    this.settings.orbitRadius = this.settings.width / (metadata.orbit.length + 1);

    // Calculate coordinates of event focus.
    const centerX = this.settings.orbitRadius / 2;
    const centerY = this.settings.height / 2;
    const theta =
        (2 * Math.PI) /
        (this.settings.nFoci || metadata.event.length - !!this.settings.eventCentral - 1);

    metadata.event.forEach((event, i) => {
        // Define radius of the orbit on which the event focus will appear.
        event.radius = event.order * this.settings.orbitRadius;

        // Define angle of event focus.
        event.theta = (2 * Math.PI * event.position) / 360;

        // Define position along orbit on which the event focus will appear.
        event.x =
            event.order === 0
                ? centerX
                : centerX +
                  event.radius * // number of orbit radii from the center
                      Math.cos(event.theta); // position along the circle at the given orbit along which
        event.y =
            event.order === 0
                ? centerY
                : centerY +
                  event.radius * // number of orbit radii from the center
                      Math.sin(event.theta); // y-position of the along the given orbit at which the focus circle at the
    });

    // Calculate dimensions of orbits.
    metadata.orbit.forEach((d, i) => {
        d.cx = centerX;
        d.cy = centerY;
        d.r = (i + 1) * this.settings.orbitRadius;
    });
}
