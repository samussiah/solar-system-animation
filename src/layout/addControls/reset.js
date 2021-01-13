import resetAnimation from '../../init/startInterval/reset/animation';
import toggle from './playPause/toggle';

export default function reset() {
    const container = this.controls.container
        .append('div')
        .classed('fdg-control fdg-control--reset', true);
    const inputs = container
        .append('div')
        .classed(`fdg-button fdg-input`, true)
        .attr('title', `Reset animation.`)
        .html('&#x21ba;');

    inputs.on('click', () => {
        resetAnimation.call(this, this.data);
        if (this.settings.playPause !== 'play') toggle.call(this);
    });

    return {
        container,
        inputs,
    };
}
