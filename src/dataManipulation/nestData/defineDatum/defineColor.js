export default function defineColor(value, colorScale) {
    const color =
        this.settings.colorBy.type !== 'frequency' ||
        this.settings.eventChangeCountAesthetic !== 'size'
            ? d3.rgb(colorScale(value)).toString()
            : 'rgb(170,170,170)';
    const fill = color.replace('rgb', 'rgba').replace(')', ', 0.5)');
    const stroke = color.replace('rgb', 'rgba').replace(')', ', 1)');

    return { color, fill, stroke };
}
