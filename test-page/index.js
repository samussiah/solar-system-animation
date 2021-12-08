fetch('./data/2e4.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        data.forEach(d => {
            delete d.duration;
        });

        const fdg = forceDirectedGraph(
            data.filter(d => !/Death/.test(d.event)),
            '#container',
            {
                individualUnit: 'patient',
                individualLabel: 'Patients',
                eventUnit: 'event',
                eventLabel: 'HFrEF events',
                timeRelative: 'since randomization',
                speed: 'fast',
                speedChange: [
                    {
                        timepoint: 60,
                        speed: 'slow',
                    },
                    {
                        timepoint: 75,
                        speed: 'medium'
                    }
                ],
                eventFocusLabelChange: [
                    {
                        old_label: 'Home',
                        new_label: 'Away',
                        timepoint: 60
                    }
                ],
                delay: 0,
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
