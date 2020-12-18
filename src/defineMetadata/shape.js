export default function shape(metadata) {
    let nest;

    if (this.settings.shapify) {
        nest = d3
            .nest()
            .key((d) => d[this.settings.shapeBy.variable])
            .entries(this.data)
            .sort((a, b) => (a.key < b.key ? -1 : 1));
    }

    return nest;
}
