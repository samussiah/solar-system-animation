import fadeIn from './runModal/fadeIn';
import fadeOut from './runModal/fadeOut';

export default function runModal() {
    this.containers.modal
        .html(this.settings.text[this.settings.modalIndex])
        .call(fadeIn, this.settings.modalSpeed);

    this.modal = d3.interval(() => {
        this.settings.modalIndex++;
        if (this.settings.modalIndex === this.settings.text.length - 1)
            this.settings.modalIndex = 0;
        this.containers.modal
            .html(this.settings.text[this.settings.modalIndex])
            .call(fadeIn, this.settings.modalSpeed);

        //if (this.settings.modalIndex === text.length - 1) {
        //    d3.timeout(() => {
        //        this.modal.stop();
        //        //this.containers.modal.classed('fdg-hidden', true);
        //    }, 8000);
        //}
    }, this.settings.modalSpeed);
}
