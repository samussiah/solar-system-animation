import isCenter from './isCenter';
import isLessThanCenter from './isLessThanCenter';

export default function getCoordinate(d) {
    return isCenter.call(this, d) ? d.y : d.y + (-1) ** isLessThanCenter.call(this, d) * 35;
}
