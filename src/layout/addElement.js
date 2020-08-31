export default function addElement(name, parent, tagName = 'div') {
    const element = parent.append(tagName).classed(`fdg-${name}`, true);

    return element;
}
