import isCenterY from './y/isCenter';
import isLessThanCenterY from './y/isLessThanCenter';

export default function categoricallyReposition(text, label, eventCount) {
    if (this.settings.colorBy.type === 'categorical') {
        text.style(
            'transform',
            (d) => `translate(${isCenterY.call(this, d) ? '-5em,0' : '0,-5em'})`
        );
        label.attr('text-anchor', 'middle');
        eventCount.attr('text-anchor', 'middle').classed('fdg-hidden', true);
    }
}
