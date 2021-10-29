export default function color() {
    return {
        colorBy: {
            type: 'frequency', // ['frequency', 'continuous', 'categorical']
            variable: null,
            label: null,
            mirror: true, // reverse color scheme?
            stratify: true, // present categories separately at each focus?
            colorScheme: 'RdYlGn',
            colorSchemes: ['blue', 'orange', 'red', 'purple', 'green', 'grey'], // must be one of D3's sequential, single-hue color schemes: https://github.com/d3/d3-scale-chromatic#sequential-single-hue
            nColors: 6, // min: 3, max: 9
        },
        color: 'rgb(170,170,170)',
        fill: null, // boolean - defined in ./defineMetadata/defineIdDependentSettings
    };
}
