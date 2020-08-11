export default function defineTimepoints(group) {
    group.forEach((d, i) => {
        d.timepoint = i === 0 ? d.duration : d.duration + group[i - 1].timepoint;
        if (i === 0) {
            d.start_timepoint = 1;
            d.end_timepoint = d.duration;
        } else {
            d.start_timepoint = group[i - 1].end_timepoint + 1;
            d.end_timepoint = d.start_timepoint + d.duration;
        }
    });
}
