export default function triangleDown(legendItem, i, spacing, radius) {
    const side = radius * 1.5;
    const dist = side / Math.sqrt(3);
    const x = spacing;
    const y = i * spacing + dist + 3;
    const centroid = [x, y];
    const top = [x, y + dist];
    const left = [x - dist, y - dist];
    const right = [x + dist, y - dist];
    legendItem
        .append('polygon')
        .attr('points', [top, left, right])
        .attr('fill', 'none')
        .attr('stroke', '#444');
}
