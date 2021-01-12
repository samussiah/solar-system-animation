export default function addSequences(controls) {
    const container = this.util.addElement('sequences', controls)
        .classed('fdg-control fdg-control--sequences', true);
    const inputs = container
        .selectAll('div')
        .data(this.settings.sequences)
        .join('div')
        .classed('fdg-button', true)
        .attr(
            'title',
            (d) => `View the sequence from ${d.start_state} to ${d.end_state}.`
        )
        .text((d,i) => `Sequence ${i + 1}`);
    inputs.on('click', function (d) {
        console.log(d);
        // 1. Update relative day given start state.
        // 2. Calculate sequence-level data for each individual.
        // 3. Run the animation form start to end.
    });

    return {
        container,
        inputs,
    };
}
