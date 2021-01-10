import makeLegend from './makeLegend';

export default function size() {
    let container;

    if (this.settings.sizify && this.settings.colorBy.type !== 'frequency') {
        container = makeLegend.call(this, 'size');
    }

    return container;
}
