export default function getColor(scale, value) {
    const color = scale !== undefined
        ? scale(value)
        : 'rgb(170,170,170)';
    const fill = color.replace('rgb', 'rgba').replace(')', ', 0.5)');
    const stroke = color.replace('rgb', 'rgba').replace(')', ', 1)');

    return { color, fill, stroke };
}
