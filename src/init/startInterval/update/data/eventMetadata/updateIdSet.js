// Maintain a set of any IDs that have existed in the given state.
export default function updateIdSet(data, set) {
    data.forEach((id) => {
        set.add(id.key);
    });
}
