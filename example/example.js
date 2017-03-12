const Starburst = require('../src/Starburst');

const setsGen = require('./setsGen');

let sb;

const getURLDataName = (name, defaultName) => {
    let paramsString = window.location.search;
    let searchParams = new URLSearchParams(paramsString);
    return searchParams.get(name) || defaultName;
};

function ExampleSB() {
    const defaultSet = 'largeSets';
    this.highlightColor = '#ff1493';
    this.gradientName = 'rainbow';
    this.offsetAngle = 0;
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
    if (this.nodeHover) {
        // hack for name
        tip.innerHTML = Starburst
            .nodeToString(this.nodeHover.value || this.nodeHover.name);
        tip.style.setProperty('top', `${y + 20}px`);
        tip.style.setProperty('left', `${x + 5}px`);
        sb.nodeHover(this.nodeHover);
    } else {
        tip.innerHTML = '';
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
    gui.add(example, 'dataName', ['smallSets', 'largeSets', 'xLargeSets', 'lynx', 'constitution', 'flare'])
        .onChange((value) => {
            sb.setData(setsGen[value]);
            sb.render();
        });

    // highlight color
    // todo add opacity control
    gui.addColor(example, 'highlightColor')
        .onChange((value) => {
            sb.highlightColor = value;
            sb.nodeHover(this.nodeHover);
        });

    // gradient selections
    gui.add(example, 'gradientName', ['rainbow', 'warm', 'cool'])
        .onChange((value) => {
            sb.gradientName = value;
            sb.render();
        });

    // offsetAngle
    gui.add(example, 'offsetAngle', -Math.PI, Math.PI)
        .onChange((value) => {
            sb.offsetAngle = value;
            sb.render();
        });

    // sb.setColorFunction(() => 'rgb(255, 0, 0)');

    let tip = document.getElementById('tip');
    tip.style.setProperty('position', 'absolute');
    tip.style.setProperty('background', 'white');
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
