// TODO: make color legend reactive
export default function legends() {
    const shapeCounts = d3
        .nest()
        .key((d) => d.value.shapeValue)
        .rollup((group) => group.length)
        .entries(this.data.nested);
    this.containers.legends
        .selectAll('.fdg-legend--shape')
        .selectAll('text')
        .text((d) => {
            const shapeCount = shapeCounts.find((di) => di.key === d);
            const value = shapeCount ? shapeCount.value : 0;
            return `${d} (n=${d3.format(',d')(value)})`;
        });
}
