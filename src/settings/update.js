export default function update() {
    // Define array of modal text.
    this.settings.text = []
        .concat(
            this.settings.explanation.filter(
                (el) => !(this.settings.hideControls && el.includes('controls'))
            )
        )
        .concat(this.settings.information)
        .filter((text) => typeof text === 'string');

    //explanation: [
    //    'Each bubble in this animation represents an individual.',
    ////    'As time progresses and individuals experience events, their bubble gravitates toward the focus or "planet" representing that event.',
    //    'The number of events an individual has experienced determines the color and/or size of the bubbles.',
    //    'The number of events an individual has experienced determines the color and/or size of the bubbles.',
    //    'Static bubbles represent individuals who never experience an event.',
    //    'Use the controls on the right to interact with and alter the animation.',
    //    'Curious where everyone ends up?  Stick around to find out!',
    //], // array of strings
}
