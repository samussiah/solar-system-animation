import fadeIn from './runModal/fadeIn';
import fadeOut from './runModal/fadeOut';

export default function runModal() {
    let index = 0; // index of item in text array

    this.containers.modal.text(this.settings.text[index]).call(fadeIn, this.settings.modalSpeed);

    this.modal = d3.interval(() => {
        index++;
        if (index === this.settings.text.length - 1) index = 0;
        this.containers.modal
            .text(this.settings.text[index])
            .call(fadeIn, this.settings.modalSpeed);

        //if (index === text.length - 1) {
        //    d3.timeout(() => {
        //        this.modal.stop();
        //        //this.containers.modal.classed('fdg-hidden', true);
        //    }, 8000);
        //}
    }, this.settings.modalSpeed);
}
