export default function focus(metadata) {
    // Stratify only when the color aesthetic is categorical.
    if (this.settings.colorBy.type === 'categorical') {

        // Define a consistent arc length when positioning strata along orbit.
        if (this.settings.stratificationPositioning === 'orbital') {
            this.settings.arcLength = this.settings.orbitRadius / 200;
            this.settings.offsets =
                this.settings.stratificationPositioning === 'orbital'
                    ? metadata.strata.length % 2
                        ? d3.range(
                            -Math.floor(metadata.strata.length / 2),
                            Math.floor(metadata.strata.length / 2) + 1
                        )
                        : d3.range(-metadata.strata.length / 2 + 0.5, metadata.strata.length / 2 + 0.5)
                    : null;
        }

        // Define coordinates of stratified foci as a function of event coordinates.
        metadata.event.forEach((event, i) => {
            event.foci = metadata.strata.map((stratum, j) => {
                const focus = {
                    ...stratum,
                    x: event.x + 50 * Math.cos(stratum.angle),
                    dx: event.x + (i === 0 ? 75 : 50) * Math.cos(stratum.angle),
                    y: event.y + 50 * Math.sin(stratum.angle),
                    dy: event.y + (i === 0 ? 75 : 50) * Math.sin(stratum.angle),

                    ids: new Set(),
                    nIds: 0,
                    nIdsPrevious: 0,
                    idsCumulative: new Set(),
                    nIdsCumulative: 0,
                    nEvents: 0,
                };

                // Position stratum foci along orbits rather than on a circle at event focus.
                if (this.settings.stratificationPositioning === 'orbital') {
                    focus.theta =
                        event.theta +
                        ((this.settings.arcLength * this.settings.offsets[j]) /
                            (2 * Math.PI * event.radius)) *
                            360;

                    // Define position along orbit on which the stratum focus will appear.
                    focus.x =
                        event.order === 0
                            ? focus.x
                            : this.settings.center.x +
                              event.radius * // number of orbit radii from the center
                                  Math.cos(focus.theta); // position along the circle at the given orbit along which
                    focus.dx = focus.x;
                    focus.y =
                        event.order === 0
                            ? focus.y
                            : this.settings.center.y +
                              event.radius * // number of orbit radii from the center
                                  Math.sin(focus.theta); // y-position of the along the given orbit at which the focus circle at the
                    focus.dy = focus.y;
                }

                return focus;
            });
        });
    }
}
