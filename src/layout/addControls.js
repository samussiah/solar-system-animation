import speed from './addControls/speed';
import playPause from './addControls/playPause';
import step from './addControls/step';
import reset from './addControls/reset';
import eventList from './addControls/eventList';
import colorSizeToggle from './addControls/colorSizeToggle';

export default function addControls() {
    this.controls = {
        container: this.containers.controls,
    };
    this.controls.speed = speed.call(this);
    this.controls.playPause = playPause.call(this);
    this.controls.step = step.call(this);
    this.controls.reset = reset.call(this);
    this.controls.eventList = eventList.call(this);
    this.controls.colorSizeToggle = colorSizeToggle.call(this);
    this.controls.container
        .selectAll('.fdg-button')
        .on('mousedown', function () {
            this.classList.toggle('clicked');
        })
        .on('mouseup', function () {
            this.classList.toggle('clicked');
        });
}
