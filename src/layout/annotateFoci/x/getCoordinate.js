import isCenter from './isCenter';
import isLessThanCenter from './isLessThanCenter';

export default function getCoordinate(d) {
    return isCenter.call(this, d) ? d.x : d.x - (-1) ** isLessThanCenterX.call(this, d) * 10;
}
