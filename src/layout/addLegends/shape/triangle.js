export default function triangle(legendItem, i, spacing, radius) {
    const side = radius * 2;
    const dist = side / Math.sqrt(3);
    const x = spacing;
    const y = i * spacing + dist;
    const centroid = [x, y];
    const top = [x, y - dist];
    const left = [x - dist, y + dist];
    const right = [x + dist, y + dist];
    legendItem
        .append('polygon')
        .attr('points', [top, left, right])
        //.attr('x', spacing - radius)
        //.attr('y', i * spacing)
        //.attr('width', radius * 2)
        //.attr('height', radius * 2)
        .attr('fill', 'none')
        .attr('stroke', '#444');
}
