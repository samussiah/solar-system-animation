fetch('./data_4000.csv')
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

//        const fixed = data.filter(d => d.seq == 0)
//            .map((d,i) => {
//                const datum = Object.assign({}, d);
//                datum.id = nest.length + +datum.id;
//                datum.duration = datum.totalDuration;
//                datum.any_state_change = 0;
//                return datum;
//            });
//const array = {value: data.concat(fixed)}; // replace [ null ] with the name of the array
//const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
//const header = Object.keys(array.value[0]);
//let csv = array.value
//    .map(row => (
//        header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',')
//    ));
//csv.unshift(header.join(','));
//csv = csv.join('\r\n');
//console.log(csv);

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
