export default function color(metadata) {
    const colorBy = this.settings.colorBy;

    // scale domain
    const domain =
        colorBy.type === 'frequency'
            ? d3.range(colorBy.nColors)
            : colorBy.type === 'continuous'
            ? d3.extent(this.data, (d) => d[colorBy.variable])
            : colorBy.type === 'categorical'
            ? metadata.strata.map((d) => d.key)
            : null;

    // scale
    let scale;
    switch (colorBy.type) {
        case 'frequency':
            const range = colorBy.mirror
                ? d3[`scheme${colorBy.colorScheme}`][colorBy.nColors].reverse()
                : d3[`scheme${colorBy.colorScheme}`][colorBy.nColors];

            scale = d3
                .scaleLinear()
                .domain(domain)
                .range(range)
                .clamp(true);

            break;
        case 'continuous':
            scale = d3
                .scaleSequential(d3[`interpolate${colorBy.colorScheme}`])
                .domain(domain);

            // Invert color scale.
            if (colorBy.mirror) {
                const interpolator = scale.interpolator(); // read the color scale's interpolator
                const mirror = (t) => interpolator(1 - t); // returns the mirror image of the interpolator
                scale.interpolator(mirror); // updates the scale's interpolator
            }

            break;
        case 'categorical':
            scale = d3
                .scaleOrdinal()
                .domain(domain)
                .range(d3[`scheme${colorBy.colorScheme}`]);

            break;
        default:
            scale = null;
    }

    return scale;
}
