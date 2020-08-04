export default function id() {
    const nest = d3
        .nest()
        .key((d) => d.id)
        .rollup((group) => d3.sum(group, (d) => +d.duration))
        .entries(this.data);

    nest.forEach((d) => {
        d.duration = d.value;
        d.value = d.key;
        delete d.key;
    });

    return nest;
}
