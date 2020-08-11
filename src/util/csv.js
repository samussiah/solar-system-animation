export default function csv(array, and = true) {
    let csv = array.join(', ');
    if (and) csv = csv.replace(/, ([^,]*)$/, ' and $1');
    return csv;
}
