export default function coordinates(metadata) {
    // Dimensions of canvas.
    this.settings.orbitRadius = this.settings.width.canvas / (metadata.orbit.length + 1);

    // Calculate coordinates of event focus.
    this.settings.center = {
        x: this.settings.orbitRadius / 2,
        y: this.settings.height.main / 2,
    };

    // Calculate dimensions of orbits.
    metadata.orbit.forEach((d, i) => {
        d.cx = this.settings.center.x;
        d.cy = this.settings.center.y;
        d.r = (i + 1) * this.settings.orbitRadius;
        d.rx = d.r;
        d.ry = d.r - (d.r * i) / (i + 2);
        d.rAdj = d.r;
        d.rAdjPrev = d.r;
    });

    metadata.event.forEach((event, i) => {
        // Define radius of the orbit on which the event focus will appear.
        event.radius = event.order * this.settings.orbitRadius;
        event.rx = event.radius;
        const orbit = metadata.orbit.findIndex((orbit) => orbit.values.includes(event));
        event.ry =
            this.settings.orbitShape === 'circle' || i === 0
                ? event.radius
                : event.radius - (event.radius * orbit) / (orbit + 2);

        // Define angle of event focus.
        event.theta = (2 * Math.PI * event.position) / 360;

        // Define position along orbit on which the event focus will appear.
        event.x =
            event.order === 0
                ? this.settings.center.x
                : this.settings.center.x +
                  event.rx * // number of orbit radii from the center
                      Math.cos(event.theta); // position along the circle at the given orbit along which
        event.y =
            event.order === 0
                ? this.settings.center.y
                : this.settings.center.y +
                  event.ry * // number of orbit radii from the center
                      Math.sin(event.theta); // y-position of the along the given orbit at which the focus circle at the
    });
}
