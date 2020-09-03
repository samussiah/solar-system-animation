fetch('./data_1000.csv')
//fetch('./data_2000_fixed.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        // Remove events after first instance of death.
        const nest = d3.nest()
            .key(d => d.id)
            .rollup(nest => {
                const totalDuration = d3.sum(nest, d => +d.duration);
                for (const d of nest) {
                    d.totalDuration = totalDuration;
                    d.any_state_change = 1;
                    if (d.event === 'Death') {
                        nest.filter(di => +di.seq > +d.seq)
                            .forEach(di => {
                                data.splice(data.findIndex(dii => dii === di), 1);
                            });
                        break;
                    }
                }
            })
            .entries(data);

        data.forEach((d,i) => {
            if (d.event === 'Death')
                d.event = Math.random() < .75 ? 'Death (CV-related)' : 'Death (other)';
        });

        console.log(JSON.stringify(data, null, 4));
        console.log(JSON.stringify(data));

        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                //animationOnly: true,
                eventFinal: ['Death (CV-related)', 'Death (other)'],
                eventChangeCount: ['Hospitalization', 'ICU'],
                eventChangeCountAesthetic: 'both',
                individualCounts: [1,2,3,4],
                individualEventCounts: ['Hospitalization', 'ICU'],
                //translate: true,
                //playPause: 'play',
                //speed: 'fast',
                nFoci: 16,
                //duration: 5,
            }
        );
    });
