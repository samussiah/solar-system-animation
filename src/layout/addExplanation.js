export default function addExplanation() {
    this.explanation = this.container.append('div').classed('fdg-explanation', true)
        .style('text-align', 'left')
        .style('font-size', '20px')
        .style('font-weight', 'lighter')
        .style('width', 'calc(98% - 2px)')
        .style('border', '1px solid #333')
        .style('background', '#eee')
        .style('border-radius', '4px')
        .style('padding', '4px 1% 8px 1%');
    this.explanation.append('p').text([
        'Each bubble in the animation below represents an individual.',
        'As individuals experience events and change states, their bubble gravitates toward the focus representing that event.',
        'The number of state changes dictates the color and/or size of the bubbles.',
        'Use the controls below to interact with and alter the animation.'
    ].join(' '));
}
