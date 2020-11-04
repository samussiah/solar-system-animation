export default function isLessThanCenter(d) {
    return d.order === 1 || Math.round(d.x) < Math.round(this.settings.width / 2);
}
