import getColors from './colors';

export default function colorScale() {
    const colors = getColors();
    const colorScale = d3.scale.linear().domain(d3.range(colors.length)).range(colors).clamp(true);

    return colorScale;
}
