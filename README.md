# starburst
Experimental starburst plot visualization

### Motivation
Experimenting ways to visuzlize sets of sets and tree structured data

### Usage
 * Hover to see node name and weight
 * Click node to set it as the new root of the plot, all children will be renormalized
 * Click center node to go back up a level

## DEMO
[![image](https://cloud.githubusercontent.com/assets/823851/24077891/c19fb9d6-0c32-11e7-98d9-1f3cb7014576.png)](https://joemccourt.github.io/starburst/)

## API
`/example` provides sample sample data to play with as well as a basic way of initializing and interacting with the Starburst plot.

```
    // Initialization
    // canvas is base rendering canvas element
    // canvasH is canvas element for rendering highlighting
    sb = new Starburst(canvas, canvasH, canvas.width, canvas.height);
    
    // set data (can be a set of sets or a tree)
    sb.setData(data);
    
    // render
    sb.render();

    // find node at given x, y coords
    // true for must be inside plot, false pick closest
    let node = sb.arcAt(x, y, false);

    // highlight up to node
    sb.nodeHover(node);

    // click a node to set it as new root
    sb.nodeClick(node);
```


## Dev dependencies
* dat.gui for parameter interaction on demo page
* gulp, eslint, and browserify for development and building

## Data
* webpack demo data from chris bateman https://chrisbateman.github.io/webpack-visualizer/
* lynx text taken from wikipedia https://en.wikipedia.org/wiki/Iberian_lynx
* US Constitution
* `flare.json` from https://gist.github.com/mbostock/1093025#file-flare-json

