export default function orbits(event) {
    const nest = d3
        .nest()
        .key((d) => d.order)
        .entries(event.filter((event) => event.value !== this.settings.eventCentral))
        .map((d, i) => {
            d.cx = this.settings.width/2;
            d.cy = this.settings.height/2;
            d.r = (i + 1) * 100 + 50;

            return d;
        });

    return nest;
}
