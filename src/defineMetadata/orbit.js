export default function orbit(metadata) {
    const nest = d3
        .nest()
        .key((d) => d.order)
        .entries(metadata.event.filter((event) => event.key !== this.settings.eventCentral));

    return nest;
}
