import makeLegend from './makeLegend';

export default function size() {
    let container;

    if (this.settings.sizify && this.settings.colorBy.type !== 'frequency') {
        container = makeLegend
            .call(this, 'size')
            .classed(`fdg-legend fdg-legend--size fdg-legend--${this.settings.sizeBy.type}`, true);
    }

    return container;
}
