//import { forceSimulation, forceManyBody, forceX, forceY } from 'd3';

self.importScripts('https://d3js.org/d3-dispatch.v2.min.js');
self.importScripts('https://d3js.org/d3-quadtree.v2.min.js');
self.importScripts('https://d3js.org/d3-timer.v2.min.js');
self.importScripts('https://d3js.org/d3-force.v2.min.js');

onmessage = function(event) {
    const { nodes, x, y, strength, radius } = event.data;

    const simulation = d3.forceSimulation(nodes)
        .force('center', d3.forceCenter(x, y))
        .force('x', d3.forceX(x).strength(0.3))
        .force('y', d3.forceY(y).strength(0.3))
        .force('charge', d3.forceManyBody().strength(strength))
        //.force('charge', d3.forceManyBodyReuse().strength(strength))
        .force('collide', d3.forceCollide().radius(radius + 0.5))
        .stop();

    for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
        simulation.tick();
    }

    postMessage({ type: 'end', nodes: nodes });
};
