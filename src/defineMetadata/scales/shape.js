export default function shape(metadata) {
    let scale;

    if (this.settings.shapify) {
        const shapeBy = this.settings.shapeBy;

        // scale domain
        const domain = shapeBy.type === 'categorical' ? metadata.shape.map((d) => d.key) : null;

        // scale range
        const range = shapeBy.shapes;

        // scale
        scale = d3.scaleOrdinal().domain(domain).range(range);
    }

    return scale;
}
