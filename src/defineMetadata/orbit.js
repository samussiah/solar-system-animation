export default function orbit(metadata) {
    const nest = d3
        .nest()
        .key((d) => d.order)
        .entries(metadata.event.filter((event) => event.value !== this.settings.eventCentral));

    return nest;
}
