import getColor from './getAesthetics/getColor';
import getSize from './getAesthetics/getSize';
import getShape from './getAesthetics/getShape';

export default function getAesthetics(aestheticValues, colorScale) {
    const color = getColor.call(this, this.scales.color, aestheticValues.colorValue);
    const size = getSize.call(this, this.scales.size, aestheticValues.sizeValue);
    const shape = getShape.call(this, this.scales.shape, aestheticValues.shapeValue);

    return {
        ...color, // color, fill, stroke
        size,
        shape,
    };
}
