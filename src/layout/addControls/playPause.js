import addTimer from '../../init/addTimer';
import collide from '../../init/addForceLayout/tick/collide';

export default function playPause() {
    const fdg = this;

    const container = this.controls.append('div').classed('fdg-control fdg-control--play-pause', true);
    const playPause = [
        {action: 'play', label: 'Play', html: '&#x25B6;'},
        {action: 'pause', label: 'Pause', html: '&#x23F8;'},
    ];
    const inputs = container
        .append('button')
        .classed(`togglebutton fdg-input`, true)
        .attr('title', `${playPause.find(value => value.action !== this.settings.playPause).label} animation`)
        .html(playPause.find(value => value.action !== this.settings.playPause).html);

    inputs.on('click', function() {
        fdg.settings.playPause = playPause.find(value => value.action !== fdg.settings.playPause).action; // toggle playPause setting
        d3.select(this)
            .attr('title', `${playPause.find(value => value.action !== fdg.settings.playPause).label} animation`)
            .html(playPause.find(value => value.action !== fdg.settings.playPause).html);
        if (fdg.settings.playPause === 'play') {
            fdg.timeout = setTimeout(addTimer.bind(fdg), fdg.settings.speeds[fdg.settings.speed]);
        } else if (fdg.settings.playPause === 'pause') {
            clearTimeout(fdg.timeout);
            fdg.force.resume();
        }
    });

    return {
        container,
        inputs,
    };
}
