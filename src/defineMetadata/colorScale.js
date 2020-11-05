export default function colorScale(metadata) {
    const colorBy = this.settings.colorBy;
    const domain =
        colorBy.type === 'frequency'
            ? d3.range(this.settings.nColors)
            : colorBy.type === 'continuous'
            ? d3.extent(this.data, (d) => d[colorBy.variable])
            : colorBy.type === 'categorical'
            ? metadata.strata.map((d) => d.key)
            : null;
    const colorScale =
        colorBy.type === 'frequency'
            ? d3
                  .scaleLinear()
                  .domain(domain)
                  .range(
                      colorBy.mirror
                          ? d3[this.settings.colorScheme][this.settings.nColors].reverse()
                          : d3[this.settings.colorScheme][this.settings.nColors]
                  )
                  .clamp(true)
            : colorBy.type === 'continuous'
            ? d3.scaleSequential(d3.interpolateRdYlGn).domain(domain)
            : colorBy.type === 'categorical'
            ? d3.scaleOrdinal().domain(domain).range(d3.schemeTableau10)
            : null;

    // Invert color scale.
    if (colorBy.type === 'continuous' && colorBy.mirror) {
        const interpolator = colorScale.interpolator(); // read the color scale's interpolator
        const mirror = (t) => interpolator(1 - t); // returns the mirror image of the interpolator
        colorScale.interpolator(mirror); // updates the scale's interpolator
    }

    return colorScale;
}
