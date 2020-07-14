import speed from './addControls/speed';
import playPause from './addControls/playPause';

export default function addControls() {
    this.controls = this.container.append('div').classed('fdg-controls', true);
    speed.call(this);
    playPause.call(this);
}
