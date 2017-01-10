const setsGen = require('./setsGen');
const Starburst = require('../src/Starburst');

let RADIUS = 18; // TMP
let nodeMove = (x, y) => {
    let n = sv.arcAt(x, y, false);
    if (n) {
        tip.innerHTML = sv.getSetDisplay(n.value);
        tip.style.setProperty('top', `${y+20}px`);
        tip.style.setProperty('left', `${x+5}px`);
        sv.clearHighlight();
        sv.highlightUpTo(n);
    } else {
        tip.innerHTML = '';
    }
};

window.onload = () => {
    let canvas = document.getElementById('starburstViz');
    let canvasH = document.getElementById('starburstVizH');

    canvas.style.setProperty('position', 'absolute');
    canvasH.style.setProperty('position', 'absolute');

    let sv = new Starburst(canvas, canvasH, canvas.width, canvas.height);
    sv.updateData(setsGen.largeSets);
    sv.render();
    window.sv = sv;
    let tip = document.getElementById('tip');
    tip.style.setProperty('position', 'absolute');
    document.body.style.setProperty('margin', '0px');
    document.onmousemove = e => {
        e = e || window.event;
        let x = e.pageX;
        let y = e.pageY;
        nodeMove(x, y);
    };

    document.onclick = e => {
        e = e || window.event;
        let x = e.pageX;
        let y = e.pageY;

        // TODO: move node click to Starburst
        // clicking the center node will move up one level in tree
        // clicking on any other node will filter by all elements in that node
        let n = sv.arcAt(x, y, true);
        sv.nodeClick(n);
    };
};
