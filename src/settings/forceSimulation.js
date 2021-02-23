export default function forceSimulation() {
    return {
        manyBody: 'forceManyBodyReuse', // ['forceManyBody', 'forceManyBodyReuse', 'forceManyBodySampled']
        chargeStrength: null, // defined in ./defineMetadata/updateIdDependentSettings
        collisionPadding: 1,
        staticChargeStrength: null, // defined in ./defineMetadata/updateIdDependentSettings
        drawStaticSeparately: false, // draw static shapes in a static force simulation to improve performance
        staticLayout: 'circular', // ['circular', 'radial']
    };
}
