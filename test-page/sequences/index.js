fetch('../data/adverse-event-outcome.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        data.forEach(d => {
        });

        const visionX = 50;
        const visionHeight = 200;
        const visionWidth = 10;
        const vision = {
            value: `
                <polygon class = 'fdg-focus-annotation__text fdg-focus-annotation__foreground' points = '${visionX},-${visionHeight - visionWidth} ${visionX - visionWidth},-${visionHeight - visionWidth*2} ${visionX},-${visionHeight + visionWidth} ${visionX + visionWidth},-${visionHeight - visionWidth*2} ${visionX},-${visionHeight - visionWidth}'></polygon>
                <text class = 'fdg-focus-annotation__text fdg-focus-annotation__foreground' style = 'font-size: 2rem' alignment-baseline = 'baseline' text-anchor = 'end' transform = 'rotate(90) translate(-20,-${visionX+15})'>Vision Gain</text>
                <line class = 'fdg-custom-annotation__line' x1 = '${visionX}' y1 = '-${visionHeight}' x2 = '${visionX}' y2 = '${visionHeight}'></line>
                <text class = 'fdg-focus-annotation__text fdg-focus-annotation__foreground' style = 'font-size: 2rem' alignment-baseline = 'baseline' text-anchor = 'start' transform = 'rotate(90) translate(20,-${visionX+15})'>Vision Loss</text>
                <polygon class = 'fdg-focus-annotation__text fdg-focus-annotation__foreground' points = '${visionX},${visionHeight - visionWidth} ${visionX - visionWidth},${visionHeight - visionWidth*2} ${visionX},${visionHeight + visionWidth} ${visionX + visionWidth},${visionHeight - visionWidth*2} ${visionX},${visionHeight - visionWidth}'></polygon>
            `,
            orbit: 4,
            angle: 0,
        };
        const lossWidth = 20;
        const lossHeight = 50;
        const loss = {
            value: `
                <line stroke-linecap = 'round' x1 = '0' y1 = '0' x2 = '-${lossWidth}' y2 = '${lossHeight}' class = 'fdg-custom-annotation__line'></line>
                <text x = -${lossWidth} y = ${lossHeight + 5} class = 'fdg-focus-annotation__text fdg-focus-annotation__foreground' style = 'font-size: 1.25rem' alignment-baseline = 'hanging' text-anchor = 'end'>IOI + RAO: 10 eyes</text>
                <line stroke-linecap = 'round' x1 = '0' y1 = '0' x2 = '${lossWidth}' y2 = '${lossHeight*2}' class = 'fdg-custom-annotation__line'></line>
                <text x = ${lossWidth} y = ${lossHeight*2 + 5} class = 'fdg-focus-annotation__text fdg-focus-annotation__foreground' style = 'font-size: 1.25rem' alignment-baseline = 'hanging' text-anchor = 'middle'>IOI only: 9 eyes</text>
            `,
            orbit: 4,
            angle: 17,
            timepoint: 400,
        };
        const annotations = [vision, loss];

        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                individualUnit: 'adverse event',
                individualLabel: 'Adverse Events <sup><small>1</small></sup>',
                timeRelative: 'since onset',
                orbitLabels: [
                    'Severity',
                    'Treatment',
                    'Outcome',
                    'Efficacy Endpoint' ,
                ],
                colorBy: {
                    type: 'categorical',
                    variable: 'color',
                    label: 'Severity',
                    colorScheme: 'Tableau10',
                    stratify: false,
                    order: [
                        'Mild',
                        'Moderate',
                        'Severe',
                        'Onset',
                    ],
                },
                sizeBy: {
                    type: null,
                },
                shapeBy: {
                    type: 'categorical',
                    variable: 'shape',
                    label: 'Treatment',
                    order: [
                        'Not Treated',
                        'Standard of Care',
                        'Rescue Meds',
                    ],
                },
                freqTable: {
                    display: false,
                },
                annotations,
                speeds: {
                    fast: 25,
                },
                speed: 'fast',
                //delay: false,
                modalSpeed: 1000,
                modalPosition: 'bottom-left',
                eventCountType: 'cumulative-id',
                collisionPadding: 3,
                focusOffset: 'none',
                stateChange: 'ordered',
            }
        );
    });
