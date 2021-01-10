import makeLegend from '../makeLegend';

export default function frequency() {
    let container;

    if (this.settings.colorBy.type === 'frequency' && this.settings.sizeBy.type === 'frequency')
        container = makeLegend.call(this, 'both');
    else if (this.settings.colorBy.type === 'frequency')
        container = makeLegend.call(this, 'color');
    else if (this.settings.sizeBy.type === 'frequency')
        container = makeLegend.call(this, 'size');

    return container;
}
