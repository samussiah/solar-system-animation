export default function updateIdDependentSettings(metadata) {
    this.settings.duration = this.settings.duration || d3.max(metadata.id, (id) => id.duration);
    this.settings.text = this.settings.text
        .filter(
            (text) =>
                // Remove if:
                //   - text contains static
                //   - there are no static IDs
                //   - static IDs are drawn separately
                !(
                    /static/i.test(text) &&
                    (metadata.id.every((id) => id.static === false) ||
                        this.settings.drawStaticSeparately === false)
                )
        )
        .map((text) => text.replace('[duration]', d3.format(',d')(this.settings.duration)));
    this.settings.minRadius =
        this.settings.minRadius ||
        3000 / metadata.id.filter((d) => !(this.settings.drawStaticSeparately && d.static)).length;
    this.settings.staticRadius = this.settings.staticRadius || 3000 / metadata.id.length;
    this.settings.maxRadius =
        this.settings.maxRadius || this.settings.minRadius + this.settings.nColors;
    this.settings.chargeStrength = -(
        2000 / metadata.id.filter((d) => !(this.settings.drawStaticSeparately && d.static)).length
    );
    this.settings.staticChargeStrength = -(2000 / metadata.id.length);
    this.settings.fill = this.settings.fill || metadata.id.length <= 2500;
}
