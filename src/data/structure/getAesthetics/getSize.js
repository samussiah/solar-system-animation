export default function getSize(scale, value) {
    const size = scale !== undefined ? scale(value) : this.settings.minRadius;

    return size;
}
