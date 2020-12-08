import makeLegend from './makeLegend';

export default function frequency() {
    this.legends.color = makeLegend.call(this, 'color');
    this.legends.size = makeLegend.call(this, 'size');
    this.legends.both = makeLegend.call(this, 'both');
}
