export default function colorScale(n) {
    const colors = [
        '#a50026',
        //'#d73027',
        '#f46d43',
        //'#fdae61',
        '#fee08b',
        //'#ffffbf',
        '#d9ef8b',
        //'#a6d96a',
        '#66bd63',
        //'#1a9850',
        '#006837',
    ].reverse();

    const colorScale = d3.scale.linear().domain(d3.range(colors.length)).range(colors);

    return colorScale(Math.min(n, colors.length));
}
