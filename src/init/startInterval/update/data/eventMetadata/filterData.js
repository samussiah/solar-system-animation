// Capture IDs in the given state.
export default function filterData(data = [], props = ['value'], value = '') {
    return data.filter((d, i) => props.reduce((value, prop) => value[prop], d) === value);
}
