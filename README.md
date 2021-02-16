# Force-directed Graph
The Force-directed Graph library animates the movements of individuals between states over time.  View a live example [here](https://samussiah.github.io/force-directed-graph/test-page/).

The library supports multiple aesthetics as demonstrated in these examples:

- color
  - [categorical](https://samussiah.github.io/force-directed-graph/test-page/color/categorical/)
  - [continuous](https://samussiah.github.io/force-directed-graph/test-page/color/continuous/)
  - [frequency](https://samussiah.github.io/force-directed-graph/test-page/color/frequency/)
- size
  - [continuous](https://samussiah.github.io/force-directed-graph/test-page/size/continuous/)
  - [frequency](https://samussiah.github.io/force-directed-graph/test-page/size/frequency/)
- shape
  - [categorical](https://samussiah.github.io/force-directed-graph/test-page/shape/categorical/)

Typically the underlying data have one record per individual per state with associated start and end timepoints.  However in situations where the individuals move linearly from one state to the next without revisiting a previous state, the animation can be presented [state by state](https://samussiah.github.io/force-directed-graph/test-page/sequences/).
