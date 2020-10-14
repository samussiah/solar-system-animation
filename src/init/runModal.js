import update from './runModal/update';

export default function runModal() {
    // Set initial modal text.
    update.call(this);

    this.modal = d3.interval(() => {
        this.settings.modalIndex++;

        // Update modal text.
        update.call(this);
    }, this.settings.modalSpeed);
}
