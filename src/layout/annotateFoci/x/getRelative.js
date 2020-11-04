import isCenter from './isCenter';
import isLessThanCenter from './isLessThanCenter';

export default function getRelative(d) {
    return isCenter.call(this, d) ? 0 : isLessThanCenter.call(this, d) ? '2em' : '-2em';
}
