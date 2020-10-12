export default function id() {
    const nest = d3
        .nest()
        .key((d) => d.id)
        .rollup((group) => {
            return {
                duration: d3.sum(group, (d) => +d.duration),
                static: group.length === 1,
            };
        })
        .entries(this.data);

    nest.forEach((d,i) => {
        Object.assign(d, d.value);
        d.value = d.key;
        d.duration = d.value;
        delete d.key;
    });

    return nest;
}
