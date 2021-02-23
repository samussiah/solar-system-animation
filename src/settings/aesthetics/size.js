export default function size() {
    return {
        sizeBy: {
            type: 'frequency', // ['frequency', 'continuous']
            variable: null,
            label: null,
        },
        minRadius: null, // defined in ./defineMetadata/updateIdDependentSettings
        maxRadius: 10, // defined in ./defineMetadata/updateIdDependentSettings
        staticRadius: null, // defined in ./defineMetadata/updateIdDependentSettings
    };
}
