import isCenter from './isCenter';
import isLessThanCenter from './isLessThanCenter';

export default function getPosition(d) {
    return isCenter.call(this, d) ? 'center' : isLessThanCenter.call(this, d) ? 'bottom' : 'top';
}
