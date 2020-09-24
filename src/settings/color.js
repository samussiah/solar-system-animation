import colorScale from './colorScale';

export default function color(value) {
    return colorScale()(Math.min(value, colorScale().domain().length));
}
