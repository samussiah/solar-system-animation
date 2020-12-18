export default function focus(metadata) {
    if (this.settings.colorBy.type === 'categorical') {
        metadata.event.forEach((event, i) => {
            event.foci = metadata.strata.map((stratum, j) => {
                const focus = {
                    ...stratum,
                    x: event.x + 50 * Math.cos(stratum.angle),
                    dx: event.x + (i === 0 ? 75 : 50) * Math.cos(stratum.angle),
                    y: event.y + 50 * Math.sin(stratum.angle),
                    dy: event.y + (i === 0 ? 75 : 50) * Math.sin(stratum.angle),
                    count: 0,
                    cumulativeIds: new Set(),
                    cumulative: 0,
                };

                return focus;
            });
        });
    }
}
