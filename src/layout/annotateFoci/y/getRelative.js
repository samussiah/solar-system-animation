import isCenter from './isCenter';
import isLessThanCenter from './isLessThanCenter';

export default function getRelative(d) {
    return d.key === this.settings.eventCentral
        ? 0
        : isLessThanCenter.call(this, d)
        ? '-2.5em'
        : '2.5em';
}
