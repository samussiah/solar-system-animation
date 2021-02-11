export default function sort(has) {
    const numericId = this.data.every(
        (d) => /^-?\d+\.?\d*$/.test(d.id) || /^-?\d*\.?\d+$/.test(d.id)
    );
    this.data.sort((a, b) => {
        const id_diff = numericId ? +a.id - +b.id : a.id < b.id ? -1 : b.id < a.id ? 1 : 0;
        const timepoint_diff = a.start_timepoint - b.start_timepoint;

        return id_diff || timepoint_diff;
    });
}
