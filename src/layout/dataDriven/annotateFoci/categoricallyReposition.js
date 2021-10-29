import isCenterY from './y/isCenter';
import isLessThanCenterY from './y/isLessThanCenter';

export default function categoricallyReposition(text, label, eventCount) {
    if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify) {
        text.style(
            'transform',
            (d) => `translate(${isCenterY.call(this, d) ? '-5em,0' : '0,-5em'})`
        );
        label.attr('text-anchor', (d) =>
            d.key === this.settings.eventCentral ? 'start' : 'middle'
        );
        eventCount.attr('text-anchor', 'middle').classed('fdg-hidden', true);
    }
}
