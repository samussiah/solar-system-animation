fetch('./data/2e4.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        data.forEach(d => {
            delete d.duration;
        });

        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                individualUnit: 'patient',
                individualLabel: 'Patients with Heart Failure',
                eventUnit: 'event',
                eventLabel: 'HFrEF events',
                timeRelative: 'since randomization',
                drawStaticSeparately: true,
                shapeBy: {
                    type: 'categorical',
                    label: 'Arm',
                    variable: 'arm'
                },
                minRadius: 3,
                fill: true,
                eventChangeCount: [
                    'Hospitalization',
                    'ICU',
                ],
                freqTable: {
                    title: 'Cumulative Number of Events',
                    columns: ['label', 'event'],
                    header: false,
                },
                //playPause: 'pause',
                delay: false,
                speed: 'medium',
                loop: false,
                enforceFocusVicinity: true,
                manyBody: 'forceManyBodySampled', // ['forceManyBody', 'forceManyBodyReuse', 'forceManyBodySampled']
                root: {
                    'text-color--secondary': 'rgb(224, 1, 63)',
                    'text-color--primary': '#14385d',
                    'left-margin': '20%',
                },
            }
        );
    });
