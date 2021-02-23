//<svg height="210" width="500">
//  <polygon points="100,10 40,198 190,78 10,78 160,198"
//  style="fill:lime;stroke:purple;stroke-width:5;fill-rule:nonzero;" />
//</svg>
export default function star(legendItem) {
    const spikes = 5;
    const step = Math.PI / spikes;
    const innerRadius = this.legends.radius * 0.6;
    const outerRadius = this.legends.radius * 1.2;
    const dist = (this.legends.radius * 2) / Math.sqrt(3);

    let rot = (Math.PI / 2) * 3;
    let x = this.legends.svgWidth / 2;
    let y = this.legends.svgHeight / 2 + dist;
    const centroid = [x, y];
    let coordinates = [];

    for (let i = 0; i < spikes; i++) {
        x = centroid[0] + Math.cos(rot) * outerRadius;
        y = centroid[1] + Math.sin(rot) * outerRadius;
        coordinates.push([x, y]);
        rot += step;

        x = centroid[0] + Math.cos(rot) * innerRadius;
        y = centroid[1] + Math.sin(rot) * innerRadius;
        coordinates.push([x, y]);
        rot += step;
    }

    return legendItem
        .append('polygon')
        .attr('points', coordinates)
        .attr('fill', 'none')
        .attr('stroke', '#444');
}
