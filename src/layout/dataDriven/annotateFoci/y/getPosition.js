import isCenter from './isCenter';
import isLessThanCenter from './isLessThanCenter';

export default function getPosition(d, reverse = false) {
    let position = isCenter.call(this, d)
        ? 'middle'
        : isLessThanCenter.call(this, d)
        ? 'hanging'
        : 'baseline';
    if (reverse)
        position =
            position === 'hanging' ? 'baseline' : position === 'baseline' ? 'hanging' : position;
    return position;
}
