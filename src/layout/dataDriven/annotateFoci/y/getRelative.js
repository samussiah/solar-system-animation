import isCenter from './isCenter';
import isLessThanCenter from './isLessThanCenter';

export default function getRelative(d) {
    const centered = d.key === this.settings.eventCentral
        || this.settings.focusOffset === 'none'
        || (this.settings.focusOffset === 'heuristic' && isCenter.call(this, d));
    const above = this.settings.focusOffset === 'above'
        || (this.settings.focusOffset === 'heuristic' && isLessThanCenter.call(this, d) === true);
    const below = this.settings.focusOffset === 'below'
        || (this.settings.focusOffset === 'heuristic' && isLessThanCenter.call(this, d) === false);
    return centered ? 0 : above ? -Math.round(this.settings.height.main/12) : below ? Math.round(this.settings.height.main/12) : 0;
}
