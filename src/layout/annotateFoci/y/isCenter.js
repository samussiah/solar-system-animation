export default function isCenter(d) {
    return Math.round(d.y) === Math.round(this.settings.height / 2);
}
