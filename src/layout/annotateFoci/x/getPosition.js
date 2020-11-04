import isCenter from './isCenter';
import isLessThanCenter from './isLessThanCenter';

export default function getPosition(d) {
    return isCenter.call(this, d) ? 'middle' : isLessThanCenter.call(this, d) ? 'start' : 'end';
}
