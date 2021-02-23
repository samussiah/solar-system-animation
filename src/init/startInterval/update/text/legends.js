export default function legends(data) {
    // color legend
    if (this.settings.colorBy.type === 'categorical') {
        const colorCounts = d3
            .nest()
            .key((d) => d.value.colorValue)
            .rollup((group) => group.length)
            .entries(data.nested);
        this.legends.color.counts.text((d) => {
            const colorCount = colorCounts.find((di) => di.key === d);
            const value = colorCount ? colorCount.value : 0;
            return d3.format(',d')(value);
        });
    }

    // shape legend
    if (this.settings.shapeBy.type === 'categorical') {
        const shapeCounts = d3
            .nest()
            .key((d) => d.value.shapeValue)
            .rollup((group) => group.length)
            .entries(data.nested);
        this.legends.shape.counts.text((d) => {
            const shapeCount = shapeCounts.find((di) => di.key === d);
            const value = shapeCount ? shapeCount.value : 0;
            return d3.format(',d')(value);
        });
    }
}
