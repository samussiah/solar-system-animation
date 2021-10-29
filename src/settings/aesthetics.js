import color from './aesthetics/color';
import size from './aesthetics/size';
import shape from './aesthetics/shape';

export default function aesthetics() {
    return {
        ...color(),
        ...size(),
        ...shape(),
    };
}
