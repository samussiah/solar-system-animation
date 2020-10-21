import fadeIn from './fadeIn';
import emphasizeComponent from './emphasizeComponent';

export default function update() {
    this.modalText = this.settings.text[this.settings.modalIndex];
    if (this.settings.modalIndex === this.settings.text.length - 1) this.modal.stop();

    // Update modal text.
    this.containers.modal.html(this.modalText).call(fadeIn, this.settings.modalSpeed);

    // Highlight referenced component.
    switch (true) {
        case /time/i.test(this.modalText):
            emphasizeComponent.call(this, this.containers.progress);
            //emphasizeComponent.call(this, this.focusAnnotations);
            break;
        case /color/i.test(this.modalText):
            emphasizeComponent.call(this, this.containers.legends);
            break;
        case /static/i.test(this.modalText):
            // Style static bubbles differently than components.
            emphasizeComponent.call(
                this,
                this.containers.svgBackground.selectAll('circle.fdg-static-circle'),
                'stroke',
                'rgba(215,25,28,0)',
                'rgba(215,25,28,.5)'
            );
            break;
        case /controls/i.test(this.modalText):
            emphasizeComponent.call(this, this.containers.controls);
            break;
        default:
            break;
    }
}
