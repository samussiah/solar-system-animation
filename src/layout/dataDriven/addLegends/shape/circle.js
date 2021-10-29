export default function circle(legendItem) {
    const area = Math.PI * this.legends.radius ** 2;
    //console.log('circle: ', Math.round(area));
    return legendItem
        .append('circle')
        .attr('cx', this.legends.svgWidth / 2)
        .attr('cy', this.legends.svgHeight / 2)
        .attr('r', this.legends.radius)
        .attr('fill', 'none')
        .attr('stroke', '#444');
}
