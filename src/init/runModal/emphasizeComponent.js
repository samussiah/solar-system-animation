export default function emphasizeComponent(component) {
    //console.log(this.staticForceSimulation[0].nodes.node().tagName);
    // TODO: use tagName to style static bubbles differently.
    component
        .style('outline', 'thick groove rgba(215,25,28,0)')
        .transition()
        .duration(this.settings.modalSpeed / 15)
        .style('outline', 'thick groove rgba(215,25,28,.5)')
        .transition()
        .duration(this.settings.modalSpeed / 15)
        .delay(this.settings.modalSpeed - (this.settings.modalSpeed / 15) * 2)
        .style('outline', 'thick groove rgba(215,25,28,0)');
}
