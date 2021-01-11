export default function circle(legendItem, i, spacing, radius) {
    return legendItem
        .append('circle')
        .attr('cx', spacing)
        .attr('cy', i * spacing + 10)
        .attr('r', radius - 1)
        .attr('fill', 'none')
        .attr('stroke', '#444');
}
