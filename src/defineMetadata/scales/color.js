export default function color(metadata) {
    let scale;

    if (this.settings.colorify) {
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
        let range;

        switch (colorBy.type) {
            case 'frequency':
                range = colorBy.mirror
                    ? d3[`scheme${colorBy.colorScheme}`][colorBy.nColors].reverse()
                    : d3[`scheme${colorBy.colorScheme}`][colorBy.nColors];

                scale = d3.scaleLinear().domain(domain).range(range).clamp(true);

                break;
            case 'continuous':
                scale = d3.scaleSequential(d3[`interpolate${colorBy.colorScheme}`]).domain(domain);

                // Invert color scale.
                if (colorBy.mirror) {
                    const interpolator = scale.interpolator(); // read the color scale's interpolator
                    const mirror = (t) => interpolator(1 - t); // returns the mirror image of the interpolator
                    scale.interpolator(mirror); // updates the scale's interpolator
                }

                break;
            case 'categorical':
                const scheme = d3[`scheme${colorBy.colorScheme}`];
                range = scheme.every((el) => typeof el === 'string')
                    ? scheme
                    : scheme[Math.min(Math.max(3, domain.length), 9)];
                scale = d3
                    .scaleOrdinal()
                    .domain(domain)
                    .range(range.map((color) => d3.rgb(color) + ''));

                break;
            default:
                scale = null;
        }
    }

    return scale;
}
