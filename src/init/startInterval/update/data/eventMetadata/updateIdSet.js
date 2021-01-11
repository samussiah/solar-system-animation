// Maintain a set of any IDs that have existed in the given state.
export default function updateIdSet(data, set, cumulative = false) {
    if (cumulative)
        data.forEach((id) => {
            set.add(id.key);
        });
    else return new Set(data.map((id) => id.key));
}
