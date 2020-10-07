export default function defineRadius(stateChanges) {
    const r =
        this.settings.eventChangeCountAesthetic !== 'color'
            ? Math.min(this.settings.minRadius + stateChanges, this.settings.maxRadius)
            : this.settings.minRadius;

    return r;
}
