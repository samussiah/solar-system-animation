//fetch('../data/data_1000.csv')
fetch('../data/data_2000_fixed.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                colorBy: {
                    type: 'categorical',
                    variable: 'category',
                    label: 'Categories',
                    //stratify: false,
                },
                eventChangeCountAesthetic: 'size',
                //collisionPadding: 3,
                //manyBody: 'forceManyBodySampled',
            }
        );
    });
