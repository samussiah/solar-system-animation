import getColorScale from './scales/color';
import getSizeScale from './scales/size';
import getShapeScale from './scales/shape';

export default function scales(metadata) {
    const color = getColorScale.call(this, metadata);
    const size = getSizeScale.call(this, metadata);
    const shape = getShapeScale.call(this, metadata);

    return {
        color,
        size,
        shape,
    };
}
