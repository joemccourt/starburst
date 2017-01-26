const setsGen = require('./setsGen');
const Starburst = require('../src/Starburst');

let sv;

let nodeMove = (x, y) => {
    let n = sv.arcAt(x, y, false);
    let tip = document.getElementById('tip');
    if (n) {
        tip.innerHTML = Starburst.nodeToString(n.value);
        tip.style.setProperty('top', `${y + 20}px`);
        tip.style.setProperty('left', `${x + 5}px`);
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

    sv = new Starburst(canvas, canvasH, canvas.width, canvas.height);
    sv.setData(setsGen.largeSets);
    sv.render();

    let tip = document.getElementById('tip');
    tip.style.setProperty('position', 'absolute');
    tip.style.setProperty('background', 'white');
    document.body.style.setProperty('margin', '0px');
    document.onmousemove = (e) => {
        e = e || window.event;
        let x = e.pageX;
        let y = e.pageY;
        nodeMove(x, y);
    };

    document.onclick = (e) => {
        e = e || window.event;
        let x = e.pageX;
        let y = e.pageY;

        let n = sv.arcAt(x, y, true);
        sv.nodeClick(n);
    };
};
