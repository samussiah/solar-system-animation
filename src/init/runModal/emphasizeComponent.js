export default function emphasizeComponent(
    component,
    style = 'outline',
    value1 = 'thick groove rgba(215,25,28,0)',
    value2 = 'thick groove rgba(215,25,28,.5)'
) {
    component
        .style(style, value1)
        .transition()
        .duration(this.settings.modalSpeed / 15)
        .style(style, value2)
        .transition()
        .duration(this.settings.modalSpeed / 15)
        .delay(this.settings.modalSpeed - (this.settings.modalSpeed / 15) * 2)
        .style(style, value1)
        .on('end', () => component.style(style, null));
}
