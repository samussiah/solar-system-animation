export default function orbit(event) {
    const nest = d3
        .nest()
        .key((d) => d.order)
        .entries(event.filter((event) => event.value !== this.settings.eventCentral));

    return nest;
}
