import colorScale from './colorScale';

export default function color(n) {
    return colorScale()(Math.min(n, colorScale().domain().length));
}
