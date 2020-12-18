import makeLegend from './makeLegend';

export default function frequency() {
    if (this.settings.colorBy.type === 'frequency' && this.settings.sizeBy.type === 'frequency')
        this.legends.both = makeLegend.call(this, 'both');
    else if (this.settings.colorBy.type === 'frequency')
        this.legends.color = makeLegend.call(this, 'color');
    else if (this.settings.sizeBy.type === 'frequency')
        this.legends.size = makeLegend.call(this, 'size');
}
