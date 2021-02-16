import makeContinuous from '../makeLegend/continuous';

export default function continuous() {
    const container = this.legends.container.append('div');

    container.node().appendChild(
        makeContinuous({
            color: this.scales.color,
            title: this.settings.colorBy.label,
            width: 200,
            height: 50,
            tickValues: [
                this.scales.color.domain()[0],
                (this.scales.color.domain()[1] - this.scales.color.domain()[0]) / 2,
                this.scales.color.domain()[1],
            ],
        })
    );

    return container;
}
