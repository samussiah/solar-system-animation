fetch('./data/2e4.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        data.forEach(d => {
            delete d.duration;
        });

        const data5 = d3.nest()
            .key(d => d.id)
            .rollup(group => {
                group.forEach((d,i) => {
                    d.stdy = i + 1;
                    d.endy = i + 1;
                });

                return group;
            })
            .entries(data)
            .sort((a,b) => b.value.length - a.value.length)
            .slice(0,5)
            .map(d => d.value)
            .flat();

        const fdg = forceDirectedGraph(
            data5,
            '#container',
            {
                individualUnit: 'patient',
                individualLabel: 'Patients',
                eventUnit: 'event',
                eventLabel: 'HFrEF events',
                timeRelative: 'since randomization',
                speed: 'medium',
                //speedChange: [
                //    {
                //        timepoint: 60,
                //        speed: 'slow',
                //    },
                //    {
                //        timepoint: 75,
                //        speed: 'medium'
                //    }
                //],
                //eventFocusLabelChange: [
                //    {
                //        old_label: 'Home',
                //        new_label: 'Away',
                //        timepoint: 60
                //    }
                //],
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
