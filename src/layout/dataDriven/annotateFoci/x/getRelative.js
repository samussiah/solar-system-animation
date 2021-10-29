import isCenter from './isCenter';
import isLessThanCenter from './isLessThanCenter';

export default function getRelative(d) {
    const centered =
        d.key === this.settings.eventCentral ||
        this.settings.focusOffset === 'none' ||
        (this.settings.focusOffset === 'heuristic' && isCenter.call(this, d));
    const above =
        this.settings.focusOffset === 'above' ||
        (this.settings.focusOffset === 'heuristic' && isLessThanCenter.call(this, d) === true);
    const below =
        this.settings.focusOffset === 'below' ||
        (this.settings.focusOffset === 'heuristic' && isLessThanCenter.call(this, d) === false);

    return d.key === this.settings.eventCentral || this.settings.focusOffset === 'none'
        ? 0
        : this.settings.focusOffset === 'heuristic' && d.position === 0
        ? Math.round(this.settings.orbitRadius / 4)
        : 0;
}
