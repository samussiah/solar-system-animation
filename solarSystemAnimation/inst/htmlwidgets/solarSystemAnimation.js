HTMLWidgets.widget({
    name: 'solarSystemAnimation',
    type: 'output',
    factory: function(el, width, height) {
        return {
            renderValue: function(inputs) {
                el.innterHTML = '';

                const data = HTMLWidgets.dataframeToD3(
                    inputs.data
                );

                const settings = inputs.settings;

                console.log('data')
                console.log(data);

                console.log('settings')
                console.log(settings);

                solarSystemAnimation(
                    data,
                    el,
                    [null, undefined].includes(settings)
                        ? {}
                        : settings
                );
            },
            resize: function(width, height) {
            }
        };
    }
});
