export default function coordinates(metadata) {
    // Dimensions of canvas.
    this.settings.width =
        metadata.orbit.length * this.settings.orbitRadius * 2 +
        this.settings.orbitRadius;
    this.settings.height = this.settings.width;

    // Calculate coordinates of event focus.
    const centerX = this.settings.width / 2;
    const centerY = this.settings.height / 2;
    const theta =
        (2 * Math.PI) /
        (this.settings.nFoci || metadata.event.length - !!this.settings.eventCentral - 1);
    const thetaFactor = (i) => i - 1;

    metadata.event.forEach((event, i) => {
        event.x =
            event.order === 0
                ? centerX
                : event.order *
                      this.settings.orbitRadius *
                      Math.cos(thetaFactor(i) * theta) +
                      //Math.cos((this.settings.nFoci - i) * theta) +
                  centerX;
        event.y =
            event.order === 0
                ? centerY
                : event.order *
                      this.settings.orbitRadius *
                      Math.sin(thetaFactor(i) * theta) +
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
