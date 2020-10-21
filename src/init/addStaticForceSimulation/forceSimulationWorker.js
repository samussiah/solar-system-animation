self.importScripts('https://d3js.org/d3-dispatch.v2.min.js');
self.importScripts('https://d3js.org/d3-quadtree.v2.min.js');
self.importScripts('https://d3js.org/d3-timer.v2.min.js');
self.importScripts('https://d3js.org/d3-force.v2.min.js');
self.importScripts('https://cdn.jsdelivr.net/npm/d3-force-reuse@1.0.1/build/d3-force-reuse.min.js');

onmessage = function(event) {
    const {
        nodes, layout, radius,
        x, y, strength, // for standard force layout
        orbitRadius // for radial force layout
    } = event.data;

    const simulation = d3
        .forceSimulation()
        .nodes(nodes);

    if (layout === 'circular')
        simulation
            .force('collide', d3.forceCollide().radius(radius + 0.5)) // collision detection
            //.force('center', d3.forceCenter(x, y)) // positioning
            .force('charge', d3.forceManyBodyReuse().strength(strength)) // charge
            .force('x', d3.forceX(x).strength(0.3))
            .force('y', d3.forceY(y).strength(0.3));
    else if (layout === 'radial')
        simulation
            .force('collide', d3.forceCollide().radius(radius + 0.5)) // collision detection
            .force('r', d3.forceRadial(orbitRadius / 2)); // positioning

    // stop simulation
    simulation.stop();

    // increment simulation manually
    for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
        simulation.tick();
    }

    // return updated nodes array to be drawn and endered
    postMessage(nodes);
};
