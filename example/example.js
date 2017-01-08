const setsGen = require('../src/setsGen');
const Starburst = require('../src/Starburst');

let RADIUS = 18; // TMP
let nodeMove = (x, y) => {
    let n = sv.arcAt(x, y);
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

let nodeClick = (x, y) => {
    let n = sv.nodeAt(x, y);
    if (n) {
        sv.setFilter(n.value);
        sv.render();
        console.log(sv._sets);
    }
};

window.onload = () => {
    let canvas = document.getElementById('starburstViz');
    let canvasH = document.getElementById('starburstVizH');

    canvas.style.setProperty('position', 'absolute');
    canvasH.style.setProperty('position', 'absolute');

    let sv = new Starburst(canvas, canvasH, canvas.width, canvas.height);
    sv.updateData(setsGen.sets);
    sv.render();
    window.sv = sv;
    let tip = document.getElementById('tip');
    tip.style.setProperty('position', 'absolute');
    document.body.style.setProperty('margin', '0px');
    document.onmousemove = e => {
        e = e || window.event;
        var pageX = e.pageX;
        var pageY = e.pageY;
        if (pageX === undefined) {
            pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        let x = pageX;//e.clientX - canvas.offsetLeft - pageX;
        let y = pageY;//e.clientY - canvas.offsetTop - pageY;
        nodeMove(x, y);
    };

    document.onclick = e => {
        let x = e.clientX - canvas.offsetLeft;
        let y = e.clientY - canvas.offsetTop;
        let n = sv.arcAt(x, y);
        if (n) {
            // sv.setFilter(n.value);
            sv.render();
            // console.log(sv._sets);
        } else {
            sv.setFilter(new Set());
            sv.render();
        }
    };
};
