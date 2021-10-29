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
                individualLabel: 'Patients',
                eventUnit: 'event',
                eventLabel: 'HFrEF events',
                timeRelative: 'since randomization',
                minRadius: 3,
                fill: true,
                eventChangeCount: [
                    'Hospitalization',
                    'ICU',
                ],
                minimizeControls: true,
                root: {
                    'text-color--secondary': 'rgb(224, 1, 63)',
                    'text-color--primary': '#14385d',
                    'left-margin': '25%',
                },
            }
        );
    });
