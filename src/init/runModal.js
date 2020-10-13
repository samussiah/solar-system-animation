import fadeIn from './runModal/fadeIn';
import fadeOut from './runModal/fadeOut';
import emphasizeComponent from './runModal/emphasizeComponent';

export default function runModal() {
    // Set initial modal text.
    this.modalText = this.settings.text[this.settings.modalIndex];
    this.containers.modal
        .html(this.modalText)
        .call(fadeIn, this.settings.modalSpeed);

    this.modal = d3.interval(() => {
        this.settings.modalIndex++;
        this.modalText = this.settings.text[this.settings.modalIndex];
        if (this.settings.modalIndex === this.settings.text.length - 1) this.modal.stop();

        // Update modal text.
        this.containers.modal
            .html(this.modalText)
            .call(fadeIn, this.settings.modalSpeed);

        // Highlight referenced component.
        switch (true) {
            case /time progresses/i.test(this.modalText):
                emphasizeComponent.call(this, this.containers.progress);
                emphasizeComponent.call(this, this.focusAnnotations);
                break;
            case /determines the color/i.test(this.modalText):
                emphasizeComponent.call(this, this.containers.legends);
                break;
            case /use the controls/i.test(this.modalText):
                emphasizeComponent.call(this, this.containers.controls);
                break;
            default:
                break;
        }
    }, this.settings.modalSpeed);
}
