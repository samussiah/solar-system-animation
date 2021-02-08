export default function orbit(metadata) {
    const nest = d3
        .nest()
        .key((d) => d.order)
        .entries(metadata.event.filter((event) => event.key !== this.settings.eventCentral));

    nest.forEach((orbit, i) => {
        orbit.label =
            Array.isArray(this.settings.orbitLabels) &&
            this.settings.orbitLabels.length === nest.length
                ? this.settings.orbitLabels[i]
                : `Orbit ${i + 1}`;
        orbit.values.sort((a, b) => a.position - b.position)
            .forEach(event => {
                event.orbitLabel = orbit.label;
            });
    });

    return nest;
}
