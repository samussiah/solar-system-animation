export default function shape(metadata) {
    const shapeBy = this.settings.shapeBy;

    // scale domain
    const domain = shapeBy.type === 'categorical'
            ? metadata.shape.map((d) => d.key)
            : null;

    // scale range
    const range = shapeBy.shapes;

    // scale
    const scale = d3
        .scaleOrdinal()
        .domain(domain)
        .range(range);

    return scale;
}
