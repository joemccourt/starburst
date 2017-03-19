const Starburst = require('../src/Starburst');

const setsGen = require('./setsGen');
const demoStats = require('./webpackDemo.json');
const webpackStatsToTree = require('./webpackStatsToTree.js');
const flare = require('./flare');

setsGen.webpack = webpackStatsToTree(demoStats);
setsGen.flare = flare;

let sb;

const getURLDataName = (name, defaultName) => {
    let paramsString = window.location.search;
    let searchParams = new URLSearchParams(paramsString);
    return searchParams.get(name) || defaultName;
};

function ExampleSB() {
    const defaultSet = 'webpack';
    this.highlightColor = '#ff1493';
    this.gradientName = 'cool';
    this.colorAlgo = 'ByStart';
    this.offsetAngle = 0;
    this.zoom = 1;
    this.alphaH = 1;
    this.dataName = getURLDataName('data', defaultSet);
    if (!setsGen[this.dataName]) {
        this.dataName = defaultSet;
    }
    sb.setData(setsGen[this.dataName]);
    sb.render();
}

ExampleSB.prototype.nodeMove = (x, y) => {
    this.nodeHover = sb.arcAt(x, y, false);
    let tip = document.getElementById('tip');
    let canvasH = document.getElementById('starburstVizH');
    let isRoot = false;
    if (this.nodeHover) {
        // hack for name
        isRoot = !this.nodeHover.p;
        let name = Starburst.nodeToString(this.nodeHover.name || this.nodeHover.value);
        tip.innerHTML = `${name} - ${this.nodeHover.weight}`;

        if (this.nodeHover === sb._tree.root && !isRoot) {
            tip.innerHTML += ' - click to go up one level';
        }

        tip.style.setProperty('top', `${y + 20}px`);
        tip.style.setProperty('left', `${x + 5}px`);
        sb.nodeHover(this.nodeHover);
    } else {
        tip.innerHTML = '';
    }
    if (!isRoot && sb.arcAt(x, y, true)) {
        canvasH.style.setProperty('cursor', 'pointer');
    } else {
        canvasH.style.setProperty('cursor', 'default');
    }
};

window.onload = () => {
    let canvas = document.getElementById('starburstViz');
    let canvasH = document.getElementById('starburstVizH');

    canvas.style.setProperty('position', 'absolute');
    canvasH.style.setProperty('position', 'absolute');

    sb = new Starburst(canvas, canvasH, canvas.width, canvas.height);
    let example = new ExampleSB();

    // dat gui controls for demos
    let gui = new window.dat.GUI();

    // data set selections
    gui.add(example, 'dataName', ['smallSets', 'largeSets', 'xlargeSets', 'webpack', 'lynx', 'constitution', 'flare'])
        .onChange((value) => {
            sb.setData(setsGen[value]);
            sb.render();
        });

    // gradient selections
    gui.add(example, 'gradientName', ['rainbow', 'warm', 'cool', 'gray'])
        .onChange((value) => {
            sb.gradientName = value;
            sb.render();
        });

    // color algo
    gui.add(example, 'colorAlgo', ['ByStart', 'Relative', 'Depth'])
        .onChange((value) => {
            sb.colorAlgo = value;
            sb.render();
        });

    // highlight color
    // todo add opacity control
    gui.addColor(example, 'highlightColor')
        .onChange((value) => {
            sb.highlightColor = value;
            sb.nodeHover(this.nodeHover);
        });

    // highlight alpha
    gui.add(example, 'alphaH', 0, 1)
        .onChange((value) => {
            sb.alphaH = value;
            sb.nodeHover(this.nodeHover);
        });

    // offsetAngle
    gui.add(example, 'offsetAngle', -Math.PI, Math.PI)
        .onChange((value) => {
            sb.offsetAngle = value;
            sb.render();
        });

    // zoom
    gui.add(example, 'zoom', 0.1, 3)
        .onChange((value) => {
            sb.zoom = value;
            sb.render();
        });

    let tip = document.getElementById('tip');
    tip.style.setProperty('position', 'absolute');
    tip.style.setProperty('padding', '0.15em');
    tip.style.setProperty('background', 'white');
    tip.style.setProperty('user-select', 'none');
    document.body.style.setProperty('margin', '0px');
    document.onmousemove = (e) => {
        e = e || window.event;
        let x = e.pageX;
        let y = e.pageY;
        example.nodeMove(x, y);
    };

    document.onclick = (e) => {
        e = e || window.event;
        let x = e.pageX;
        let y = e.pageY;

        let n = sb.arcAt(x, y, true);
        sb.nodeClick(n);
    };
};
