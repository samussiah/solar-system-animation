export default function defineColor(stateChanges) {
    const color =
        this.settings.eventChangeCountAesthetic !== 'size'
            ? this.settings.color(stateChanges)
            : 'rgb(170,170,170)';
    const fill = color.replace('rgb', 'rgba').replace(')', ', 0.5)');
    const stroke = color.replace('rgb', 'rgba').replace(')', ', 1)');

    return { color, fill, stroke };
}