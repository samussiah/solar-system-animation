export default function isLessThanCenter(d) {
    return Math.round(d.y) < Math.round(this.settings.height.main / 2);
}
