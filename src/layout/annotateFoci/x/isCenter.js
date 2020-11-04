export default function isCenter(d) {
    return Math.round(d.x) === Math.round(this.settings.orbitRadius / 2);
}
