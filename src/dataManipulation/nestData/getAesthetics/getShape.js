export default function getShape(scale, value) {
    const shape = scale !== undefined
        ? scale(value)
        : this.settings.shape;

    return shape;
}
