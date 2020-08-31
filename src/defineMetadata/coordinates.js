export default function coordinates(metadata) {
    // Dimensions of canvas.
    this.settings.orbitRadius = this.settings.width / (metadata.orbit.length + 1);

    // Calculate coordinates of event focus.
    const centerX = this.settings.orbitRadius / 2;
    const centerY = this.settings.height / 2;
    const theta =
        (2 * Math.PI) /
        (this.settings.nFoci || metadata.event.length - !!this.settings.eventCentral - 1);
    const thetaFactor = (i) =>
        i === 0 ? 0 : i === 1 ? -1.75 : i === 2 ? 0.75 : i === 3 ? -0.25 : i === 4 ? 0.25 : 0;

    metadata.event.forEach((event, i) => {
        event.x =
            event.order === 0
                ? centerX
                : event.order * this.settings.orbitRadius * Math.cos(thetaFactor(i) * theta) +
                  //Math.cos((this.settings.nFoci - i) * theta) +
                  centerX;
        event.y =
            event.order === 0
                ? centerY
                : event.order * this.settings.orbitRadius * Math.sin(thetaFactor(i) * theta) +
                  //Math.sin((this.settings.nFoci - i) * theta) +
                  centerY;
    });

    // Calculate dimensions of orbits.
    metadata.orbit.forEach((d, i) => {
        d.cx = centerX;
        d.cy = centerY;
        d.r = (i + 1) * this.settings.orbitRadius;
    });
}
