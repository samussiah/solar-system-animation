export default function travelTime(d) {
    // traveling inputs:
    // - origin state
    // - destination state
    // - duration of destination state
    // - time passed since changing states
    // - distance to destination state
    //
    // considerations:
    // - state changes in transit
    //   - node must spend a minimum amount of time in transit before moving to the next state

    const origin = d.value.statePrevious;
    const destination = d.value.state;
    const duration = d.value.state.duration;
    const transitTime = this.settings.timepoint - d.value.state.start_timepoint;
    const transitThreshold =
        (d.value.state.event_order * 100) /
        Math.ceil(Math.sqrt(this.settings.speeds[this.settings.speed]));

    //if (
    //    !(
    //        d.value.state.duration < travelTime
    //        && d.value.timeSincePreviousState < travelTime
    //        && d.value.statePrevious?.event !== 'Home'
    //    )
    //)
    // TODO: don't use vicinity, use time in transit:
    // - If the duration in a state is less than the threshold, say orbit * 10, the time
    //   since last state change must reach a certain point before the node moves to
    //   the next state.
    //
    // - example:
    //   -  duration: 5
    //   -     orbit: 2
    //   - threshold: 2 * 10 = 20
    //   > time since last state change must reach 20 before updating the node's coords

    const updateDestination = transitTime >= transitThreshold;

    return updateDestination;
}
