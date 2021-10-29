export default function diamond(legendItem) {
    const side = Math.sqrt(Math.PI) * this.legends.radius;
    const x = this.legends.svgWidth / 2;
    const y = this.legends.svgHeight / 2;
    return legendItem
        .append('rect')
        .attr('transform', `rotate(45 ${x} ${y})`)
        .attr('x', x)
        .attr('y', y)
        .attr('width', side)
        .attr('height', side)
        .attr('fill', 'none')
        .attr('stroke', '#444');
}
