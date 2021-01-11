export default function addElement(name, parent, tagName = 'div') {
    const element = parent
        .append(tagName)
        .classed(`fdg-${tagName}`, true)
        .classed(`fdg-${name}`, true)
        .classed(`fdg-${tagName}--${name}`, true);

    return element;
}
