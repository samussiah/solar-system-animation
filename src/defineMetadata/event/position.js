export default function position(nest) {
    // Group events by orbit as determined by event order.
    d3.nest()
        .key((d) => d.order)
        .rollup((group) => {
            const n = group.length;
            // TODO: angle should be a function of order, e.g. the angle should decrease the greater the order.
            const range = d3.range(-45, 46);

            // If the angle is not specified in the data, calculate an angle between -45° and 45°.
            group.forEach((d, i) => {
                d.position =
                    d.position === null
                        ? d3.quantile(range, (i + 1) / (n + 1))
                        : d.position;
            });
        })
        .entries(nest);
}
