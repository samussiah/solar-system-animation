// Maintain a set of any IDs that have existed in the given state.
export default function updateIdSet(data, set, toggle) {
    data.forEach((id) => {
        if (toggle === true)
            set.has(id.key) ? set.delete(id.key) : set.add(id.key);
        else
            set.add(id.key);
    });
}
