export default function getColorScale(colorValue) {
    const colorScale =
        this.settings.stratify && this.settings.sizeBy.type === 'frequency'
            ? this.metadata.strata
                .find((stratum) => stratum.key === colorValue)
                .colorScale
            : this.scales.color;

    return colorScale;
}
