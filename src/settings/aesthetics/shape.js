export default function shape() {
    return {
        shapeBy: {
            type: 'categorical', // ['categorical']
            variable: null,
            label: null,
            shapes: ['circle', 'square', 'triangle', 'diamond', 'star', 'triangleDown'],
        },
        shape: 'circle', // string - default shape
    };
}
