import fadeIn from './fadeIn';
import emphasizeComponent from './emphasizeComponent';

export default function update() {
    this.modalText = this.settings.text[this.settings.modalIndex];
    if (this.settings.modalIndex === this.settings.text.length - 1 && this.modal) this.modal.stop();

    // Update modal text.
    this.layout.modal.html(this.modalText).call(fadeIn, this.settings.modalSpeed);

    // Highlight referenced component.
    switch (true) {
        case /time/i.test(this.modalText):
            emphasizeComponent.call(this, this.layout.progress);
            //emphasizeComponent.call(this, this.focusAnnotations);
            break;
        case /annotations/i.test(this.modalText):
            emphasizeComponent.call(
                this,
                this.layout.focusAnnotations.selectAll('.fdg-focus-annotation__event-count')
            );
            break;
        case /number of events.*color/i.test(this.modalText):
            emphasizeComponent.call(this, this.legends.color);
            break;
        case /number of events.*size/i.test(this.modalText):
            emphasizeComponent.call(this, this.legends.size);
            break;
        case /static/i.test(this.modalText):
            // Style static bubbles differently than components.
            emphasizeComponent.call(
                this,
                this.layout.svgBackground.selectAll('.fdg-static__mark'),
                'stroke',
                'rgba(215,25,28,0)',
                'rgba(215,25,28,.5)',
                false
            );
            break;
        case /controls/i.test(this.modalText):
            if (this.settings.hideControls === false)
                emphasizeComponent.call(
                    this,
                    this.layout.controlsContainer.classed('fdg-hidden', this.settings.hideControls)
                );
            break;
        default:
            break;
    }
}
