self.importScripts('https://d3js.org/d3-dispatch.v2.min.js');
self.importScripts('https://d3js.org/d3-quadtree.v2.min.js');
self.importScripts('https://d3js.org/d3-timer.v2.min.js');
self.importScripts('https://d3js.org/d3-force.v2.min.js');
self.importScripts('https://cdn.jsdelivr.net/npm/d3-force-reuse@1.0.1/build/d3-force-reuse.min.js');
self.importScripts(
    'https://cdn.jsdelivr.net/npm/d3-force-sampled@1.0.0/build/d3-force-sampled.min.js'
);

onmessage = function (event) {
    console.log(event.data.type);
    const forceSimulation = d3.forceSimulation();
    if (event.data.type === 'initialize') {
        const {
            nodes,
            centerX,
            centerY,
            chargeStrength,
            minRadius,
        } = event.data;

        forceSimulation
            .nodes(nodes)
            .alphaDecay(0.01)
            .velocityDecay(0.9)
            .force('center', d3.forceCenter(centerX, centerY))
            .force('x', d3.forceX().x(d => d.value.coordinates.x).strength(0.3))
            .force('y', d3.forceY().y(d => d.value.coordinates.y).strength(0.3))
            .force('charge', d3.forceManyBody().strength(chargeStrength))
            //.force('charge', forceManyBodyReuse().strength(chargeStrength))
            //.force('charge', forceManyBodySampled().strength(chargeStrength*2))
            .force(
                'collide',
                //d3.forceCollide().radius((d) => d.value.r + 0.5)
                d3.forceCollide().radius(minRadius + 1)
            );
    } else if (event.data.type === 'reheat') {
        //if (this.settings.timepoint === 1) this.forceSimulation.force('center', null);
        forceSimulation
            .alpha(1)
            .force('x', d3.forceX().x(d => d.value.coordinates.x).strength(0.3))
            .force('y', d3.forceY().y(d => d.value.coordinates.y).strength(0.3))
            .restart()
            .on('tick', function() {
                console.log(forceSimulation.nodes());
            });
    }

    // return updated nodes array to be drawn and rendered
    //postMessage(forceSimulation);
};
