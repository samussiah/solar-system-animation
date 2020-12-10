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
        .text((d) => `${d} (n=${shapeCounts.find((di) => di.key === d).value})`);
}
