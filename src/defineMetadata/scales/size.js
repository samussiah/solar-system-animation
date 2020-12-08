export default function size(metadata) {
    const sizeBy = this.settings.sizeBy;

    // scale domain
    const domain = sizeBy.type === 'frequency'
            ? [0, this.settings.colorBy.nColors]
            : sizeBy.type === 'continuous'
            ? d3.extent(this.data, (d) => d[sizeBy.variable])
            : null;

    // scale range
    const range = [this.settings.minRadius, this.settings.maxRadius];

    // scale
    const scale = d3
        .scaleLinear()
        .domain(domain)
        .range(range)
        .clamp(true);

    return scale;
}
