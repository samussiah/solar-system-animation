export default function text() {
    const text = [
        'Each bubble in this animation represents an individual.',
        'As individuals experience events and change states, their bubble gravitates toward the focus representing that event.',
        'The number of state changes dictates the color and/or size of the bubbles.',
        'Use the controls above to interact with and alter the animation.',
    ];

    return this.settings.hideControls ? text.slice(0, 3) : text;
}
