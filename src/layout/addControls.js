import addDisplay from './addControls/display';
import addSequences from './addControls/sequences';
import addStepSequences from './addControls/stepSequences';
import addSpeed from './addControls/speed';
import addPlayPause from './addControls/playPause';
import addTimepoint from './addControls/timepoint';
import addReset from './addControls/reset';
import addEventList from './addControls/eventList';

export default function addControls() {
    const main = this;

    this.controls = {
        container: this.containers.controls,
    };

    this.controls.display = addDisplay.call(this);
    this.controls.playPause = addPlayPause.call(this);
    this.controls.timepoint = addTimepoint.call(this);
    this.controls.sequences = addSequences.call(this);
    this.controls.stepSequences = addStepSequences.call(this);
    this.controls.speed = addSpeed.call(this);
    this.controls.reset = addReset.call(this);
    this.controls.eventList = addEventList.call(this);

    // Capture all controls in a selection.
    this.controls.containers = this.controls.container.selectAll('.fdg-control');

    // Capture all buttons in a selection.
    this.controls.buttons = this.controls.container.selectAll('.fdg-button');

    // Add interactivity to buttons.
    this.controls.container
        .selectAll('.fdg-button')
        .on('mousedown', function () {
            this.classList.toggle('fdg-button--clicked');
        })
        .on('mouseup', function () {
            this.classList.toggle('fdg-button--clicked');
        })
        .on('mouseout', function () {
            if (this.classList.contains('fdg-button--clicked'))
                this.classList.toggle('fdg-button--clicked');
        });
}
