export default function modal() {
    return {
        modal: true, // display modals?
        modalSpeed: 10000, // amount of time for which each modal appears
        modalIndex: 0,
        modalPosition: 'center', // ['center', 'top-left', 'top-right', 'bottom-right', 'bottom-left']
        modalWidth: '50%',
        explanation: [
            'Each shape in this animation represents an individual.',
            'As <span class = "fdg-emphasized">time progresses</span> and individuals experience events, their shape gravitates toward the focus or "planet" representing that event.',
            'The <span class = "fdg-emphasized">annotations</span> at each focus represent the [event-count-type].',
            'The <span class = "fdg-emphasized">number of events</span> an individual has experienced determines the [frequency-aesthetic] of their shape.',
            '<span class = "fdg-emphasized">Static shapes</span> represent individuals who never experience an event.',
            'Use the <span class = "fdg-emphasized">controls</span> on the right to interact with and alter the animation.',
            'Continue watching to learn how these individuals progress.', // over the course of [duration] days.',
        ], // array of strings
        information: null, // array of strings
    };
}
