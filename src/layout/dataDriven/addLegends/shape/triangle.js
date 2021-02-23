export default function triangle(legendItem) {
    const side = this.legends.radius * 2.69; // side length
    const height = (side * Math.sqrt(3)) / 2; // height of triangle
    const x = this.legends.svgWidth / 2; // horizontal centerpoint
    const y = height / 2; // vertical centerpoint
    const area = (1 / 2) * side * height; // 1/2 * base * height
    console.log('triangle: ', Math.round(area));

    // vertices
    const top = [x, y - height / 2];
    const left = [x - height / 2, y + height / 2];
    const right = [x + height / 2, y + height / 2];

    return legendItem
        .append('polygon')
        .attr('points', [top, left, right])
        .attr('fill', 'none')
        .attr('stroke', '#444');
}
