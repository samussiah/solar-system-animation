import getText from './runModal/text';
import fadeIn from './runModal/fadeIn';
import fadeOut from './runModal/fadeOut';

export default function runModal() {
    const text = getText.call(this);
    let index = 0; // index of item in text array

    this.containers.modal.text(text[index]).call(fadeIn);

    this.modal = d3.interval(() => {
        index++;
        this.containers.modal.text(text[index]).call(fadeIn);

        if (index === text.length - 1) {
            d3.timeout(() => {
                this.modal.stop();
                //this.containers.modal.classed('fdg-hidden', true);
            }, 8000);
        }
    }, 10000);
}
