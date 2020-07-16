export default function mutateData() {
    const numericId = this.data.every(
        (d) => /^-?\d+\.?\d*$/.test(d.id) || /^-?\d*\.?\d+$/.test(d.id)
    );

    this.data
        .sort((a, b) => {
            const id_diff = numericId ? +a.id - +b.id : a.id < b.id ? -1 : b.id < a.id ? 1 : 0;
            const seq_diff = a.seq - b.seq;

            return id_diff || seq_diff;
        })
        .forEach((d) => {
            d.seq = parseInt(d.seq);
            d.duration = parseFloat(d.duration);
        });
}
