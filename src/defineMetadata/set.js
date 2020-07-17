export default function set(variable) {
    const set = Array.from(new Set(this.data.map((d) => d[variable]))).map((value) => ({ value }));

    return set;
}
