export default function square(legendItem, i, spacing, radius) {
    return legendItem
        .append('rect')
        .attr('x', spacing - radius + 1.5)
        .attr('y', i * spacing + radius / 2 + 1)
        .attr('width', radius * 1.5)
        .attr('height', radius * 1.5)
        .attr('fill', 'none')
        .attr('stroke', '#444');
}
