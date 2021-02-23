export default function square(legendItem) {
    const side = Math.sqrt(Math.PI) * this.legends.radius;
    const area = side ** 2;
    console.log('square: ', Math.round(area));
    return legendItem
        .append('rect')
        .attr('x', this.legends.svgWidth / 2 - side / 2)
        .attr('y', this.legends.svgHeight / 2 - side / 2)
        .attr('width', side)
        .attr('height', side)
        .attr('fill', 'none')
        .attr('stroke', '#444');
}
