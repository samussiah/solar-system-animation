export default function id() {
    const nest = d3
        .nest()
        .key((d) => d.id)
        .rollup((group) => {
            return {
                duration: d3.sum(group, (d) => +d.duration),
                static: group.length === 1,
                colorStratum:
                    this.settings.colorBy.type === 'categorical'
                        ? group[0][this.settings.colorBy.variable]
                        : null,
                shapeStratum:
                    this.settings.shapeBy.type === 'categorical'
                        ? group[0][this.settings.shapeBy.variable]
                        : null,
            };
        })
        .entries(this.data);

    nest.forEach((d, i) => {
        Object.assign(d, d.value);
    });

    return nest;
}
