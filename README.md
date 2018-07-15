# visuals
A repository for all kinds of cool visuals, animations and visualisations.

### Minimal Spanning Tree
[See here.](https://nick-hiebl.github.io/visuals/mst/)

### Dinosaur Game
[See here.](https://nick-hiebl.github.io/visuals/dino/)

### Traveling Salesman Problem
[See here.](https://nick-hiebl.github.io/visuals/tsp/)

### Braitenberg Vehicle Simulation
[See here.](https://nick-hiebl.github.io/visuals/vehicles/)

### Flocking Logic
[See here.](https://nick-hiebl.github.io/visuals/flocking/)

### [Wolfram Cellular Automata](#wolfram-cellular-automata)
[See here.](https://nick-hiebl.github.io/visuals/wolfram/)
This is an implementation of cellular automata as described in Stephen
Wolfram's book "A New Kind of Science". Rules are given codes which are
based upon responses for a cell to the three cells above it. The codes
for 12 particularly interesting rules have been added as buttons for you
to try out, though a full list of all rules and pictures as well as
some explanation and analysis can be found in [places online](http://mathworld.wolfram.com/ElementaryCellularAutomaton.html)
as well as Wolfram's textbook itself.

### [3 State Cellular Automata](#3-state-cellular-automata)
[See here.](https://nick-hiebl.github.io/visuals/wolfram-3/)
This is an implementation of a similar kind of automata as above, but
for a 3-state case, where each tile can either be white, blue or black.
This would result in an enormous amount of possible rules however and a
huge amount of complexity. So for simplicity only "totalistic" rules are
implemented. That is, rules which only care about the "average" of the
preceding cells. This sounds like it is a huge loss of complexity, but
it's actually still very powerful and capable of producing patterns much
more rich and complex than those in the standard 2-state case.
