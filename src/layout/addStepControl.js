import addTimer from '../init/addTimer';

export default function addStepControl() {
    const fdg = this;

    const container = this.controls.append('div').classed('fdg-control fdg-control--step', true);
    const inputs = container
        .append('button')
        .classed(`togglebutton fdg-input`, true)
        .attr('title', `Advance animation by one time unit`)
        .text('Advance');

    inputs.on('click', function() {
        fdg.timeout = setTimeout(addTimer.bind(fdg), fdg.settings.speeds[fdg.settings.speed]);
        clearTimeout(fdg.timeout);
    });

    return {
        container,
        inputs,
    };
}
