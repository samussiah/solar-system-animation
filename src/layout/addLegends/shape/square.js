export default function square(legendItem, i, spacing, radius) {
    legendItem
        .append('rect')
        .attr('x', spacing - radius)
        .attr('y', i * spacing + radius / 2)
        .attr('width', radius * 2)
        .attr('height', radius * 2)
        .attr('fill', 'none')
        .attr('stroke', '#444');
}
