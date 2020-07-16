export default function id() {
    this.metadata.id.forEach(id => {
        id.duration = d3.sum(this.data.filter(d => d.id === id.value), d => +d.duration);
    });
}
