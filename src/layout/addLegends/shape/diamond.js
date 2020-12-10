export default function diamond(legendItem, i, spacing, radius) {
    const x = spacing;
    const y = i * spacing;
    legendItem
        .append('rect')
        .attr('transform', `rotate(45 ${x} ${y})`)
        .attr('x', x)
        .attr('y', y)
        .attr('width', radius * 1.5)
        .attr('height', radius * 1.5)
        .attr('fill', 'none')
        .attr('stroke', '#444');
}
