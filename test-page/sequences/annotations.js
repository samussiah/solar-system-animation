const visionX = 50;
const visionHeight = 200;
const visionWidth = 10;
const vision = {
    value: `
        <polygon class = 'fdg-focus-annotation__text fdg-focus-annotation__foreground' points = '${visionX},-${visionHeight - visionWidth} ${visionX - visionWidth},-${visionHeight - visionWidth*2} ${visionX},-${visionHeight + visionWidth} ${visionX + visionWidth},-${visionHeight - visionWidth*2} ${visionX},-${visionHeight - visionWidth}'></polygon>
        <text class = 'fdg-focus-annotation__text fdg-focus-annotation__foreground' style = 'font-size: 2rem' alignment-baseline = 'baseline' text-anchor = 'end' transform = 'rotate(90) translate(-90,-${visionX+15})'>Better</text>
        <line class = 'fdg-custom-annotation__line' x1 = '${visionX}' y1 = '-${visionHeight}' x2 = '${visionX}' y2 = '${visionHeight}'></line>
        <text class = 'fdg-focus-annotation__text fdg-focus-annotation__foreground' style = 'font-size: 2rem' alignment-baseline = 'baseline' text-anchor = 'start' transform = 'rotate(90) translate(90,-${visionX+15})'>Worse</text>
        <polygon class = 'fdg-focus-annotation__text fdg-focus-annotation__foreground' points = '${visionX},${visionHeight - visionWidth} ${visionX - visionWidth},${visionHeight - visionWidth*2} ${visionX},${visionHeight + visionWidth} ${visionX + visionWidth},${visionHeight - visionWidth*2} ${visionX},${visionHeight - visionWidth}'></polygon>
    `,
    orbit: 4,
    angle: 0,
};
const lossWidth = 25;
const lossHeight = 25;
const loss = {
    value: `
        <line stroke-linecap = 'round' x1 = '0' y1 = '0' x2 = '-${lossWidth}' y2 = '${lossHeight}' class = 'fdg-custom-annotation__line'></line>
        <text x = -${lossWidth} y = ${lossHeight + 5} class = 'fdg-focus-annotation__text fdg-focus-annotation__foreground' style = 'font-size: 1.25rem' alignment-baseline = 'hanging' text-anchor = 'end'>IOI + RAO: 10 eyes</text>
        <line stroke-linecap = 'round' x1 = '0' y1 = '0' x2 = '${lossWidth}' y2 = '${lossHeight}' class = 'fdg-custom-annotation__line'></line>
        <text x = ${lossWidth} y = ${lossHeight + 5} class = 'fdg-focus-annotation__text fdg-focus-annotation__foreground' style = 'font-size: 1.25rem' alignment-baseline = 'hanging' text-anchor = 'start'>IOI only: 9 eyes</text>
    `,
    orbit: 4,
    angle: 22,
    timepoint: 400,
};
const annotations = [vision, loss];
