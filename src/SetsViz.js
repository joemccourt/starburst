const setsGen = require('./setsGen');
const RADIUS = 18;

const setDisplay = (set, maxLength, joinChar = ',') => {
    if (maxLength === undefined) {
        maxLength = set.length;
    }
    let array = [...set].slice(0, maxLength);
    if (set.size > maxLength) {
        array[maxLength-1] = '...';
    }
    return array.join(joinChar);
};

const flatCount = (sets) => {
    let counts = {};
    sets.forEach(s => {
        s.forEach(e => {
            counts[e] = (counts[e] || 0) + 1;
        });
    });
    return counts;
};

const mapMax = (map) => {
    let max = 0;
    let maxV = '';
    for (let k in map) {
        if (map[k] > max) {
            max = map[k];
            maxV = k;
        }
    }
    return maxV;
};

class SetsViz {
    constructor(ctx, ctxH, w, h) {
        this._ctx = ctx;
        this._ctxH = ctxH;
        this.setSize(w, h);
    }

    setSize(w, h) {
        this._w = w;
        this._h = h;
    }

    setFilter(set) {
        let sets = this._sets0;
        this._sets = new Set();
        for (let i = 0; i < sets.length; i++) {
            let s = new Set(sets[i]);
            s.delete('');

            // filter
            if([...set].every(e => s.has(e))) {
                // console.log('has all', s);
                this._sets.add(s);
            }
        }
        console.log(this._sets);
        this.buildData(this._sets);
    }

    // sets as 2d array
    updateData(sets) {
        this._sets0 = sets;
        this._sets = new Set();
        for (let i = 0; i < sets.length; i++) {
            let s = new Set(sets[i]);
            s.delete('');
            this._sets.add(s);
        }
        this.buildData(this._sets);
    }

    buildData(sets) {
        let forrest = {
            value: new Set(),
            depth: 0,
            n: sets.size,
            xStart: 0,
            xWidth: 1,
            isLeaf: false,
            children: []
        };
        this._buildForrest(forrest, sets);
        this._linkParents(forrest);
        this._calPos(forrest);

        this._forrest = forrest;
        console.log(forrest);
    }

    // build a forrest of trie trees
    _buildForrest(parent, sets, countsMap) {
        if (sets.size === 0) {
            return;
        }
        if (!countsMap) {
            countsMap = flatCount(sets);
        }

        let mostCommonElement = mapMax(countsMap);

        let childrenSets = new Set();
        let sideTrieSets = new Set();

        let childrenCounts = {};
        let sideCounts = {};

        let isLeaf = false;

        sets.forEach(s => {
            if (s.has(mostCommonElement)) {
                s.delete(mostCommonElement);
                if (s.size > 0) {
                    childrenSets.add(s);
                } else {
                    isLeaf = true;
                }
                s.forEach(e => {
                    childrenCounts[e] = (childrenCounts[e] || 0) + 1;
                });
            } else if(s.size) {
                sideTrieSets.add(s);
                s.forEach(e => {
                    sideCounts[e] = (sideCounts[e] || 0) + 1;
                });
            }
        });

        if (parent.children.length > 0 || sideTrieSets.size > 0 || parent.isLeaf) {
            let childTrie = {
                value: new Set([mostCommonElement]),
                p: parent,
                n: childrenSets.size,
                xWidth: childrenSets.size / parent.n * parent.xWidth,
                isLeaf,
                children: []
            };
            parent.children.push(childTrie);
            this._buildForrest(childTrie, childrenSets, childrenCounts);
            this._buildForrest(parent, sideTrieSets, sideCounts);
        } else {
            parent.isLeaf = isLeaf;
            parent.value.add(mostCommonElement);
            this._buildForrest(parent, childrenSets, childrenCounts);
        }
    }

    _linkParents(forrest) {
        for(let i = 0; i < forrest.children.length; i++) {
            let c = forrest.children[i];
            c.p = forrest;
            this._linkParents(c);
        }
    }

    _calPos(forrest) {
        let maxDepth = 0;
        let q = [{
            n: forrest,
            d: 0
        }];

        let numChildrenByDepth = [];
        while (q.length) {
            let node = q.shift();
            if (node.n) {
                if (node.d > maxDepth) {
                    maxDepth = node.d;
                }
                node.n.col = numChildrenByDepth[node.d] || 0;
                numChildrenByDepth[node.d] = node.n.col + 1;
                node.n.depth = node.d;
                for (let i = 0; i < node.n.children.length; i++) {
                    let c = node.n.children[i];
                    q.push({
                        n: c,
                        d: node.d+1
                    });
                }
            }
        }
        this._maxDepth = maxDepth;
        let yPadd = 10 + RADIUS;
        let xPadd = RADIUS;

        q = [{
            n: forrest
        }];
        while (q.length) {
            let node = q.shift();
            if (node.n) {
                let k = numChildrenByDepth[node.n.depth];
                let x = xPadd + (this._w - 2*xPadd) / k * (node.n.col+0.5);
                let y = yPadd + (this._h - 2*yPadd) * (node.n.depth) / (this._maxDepth || 1);
                node.n.y = y;
                node.n.x = x;
                node.n.fractionStart = node.n.col / k;
                for (let i = 0; i < node.n.children.length; i++) {
                    let c = node.n.children[i];
                    q.push({
                        n: c
                    });
                }
            }
        }
    }

    nodeAt(x, y) {
        let q = [this._forrest];
        let r = RADIUS;
        while (q.length) {
            let node = q.shift();
            if (Math.pow(node.x-x,2) + Math.pow(node.y-y,2) < r*r) {
                return node;
            }
            for (let i = 0; i < node.children.length; i++) {
                let c = node.children[i];
                q.push(c);
            }
        }
    }

    arcAt(x, y) {
        let q = [this._forrest];
        let r = this._arcRadius;
        let x0 = (this._w - 1) / 2;
        let y0 = (this._h - 1) / 2;
        let dx = x - x0;
        let dy = y - y0;
        let dr = Math.sqrt(dx*dx + dy*dy);
        let depth = Math.floor(dr / r);

        let angle = Math.atan2(-dy, dx);
        let fraction = angle / (Math.PI * 2);
        if (fraction < 0) {
            fraction += 1;
        }

        if (depth === 0) {
            return q[0];
        }

        while (q.length) {
            let node = q.shift();
            if (node.depth === depth && fraction >= node.xStart && fraction <= (node.xStart + node.xWidth)) {
                return node;
            }
            for (let i = 0; i < node.children.length; i++) {
                let c = node.children[i];
                q.push(c);
            }
        }
    }

    nodeValueAbove(n) {
        let value = new Set();
        while(n.p) {
            let v = [...n.p.value];
            v.forEach(e => {
                value.add(e);
            });
            n = n.p;
        }
        value.delete();
        return value;
    }

    render() {
        let ctx = this._ctx;
        ctx.clearRect(0, 0, this._w, this._h);

        let q = [this._forrest];
        let r = RADIUS;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'black';
        while (q.length) {
            let node = q.shift();
            let x = node.x;
            let y = node.y;
            let d = node.depth;

            for (let i = 0; i < node.children.length; i++) {
                let c = node.children[i];
                q.push(c);

                ctx.beginPath();
                if (c.value.size > 0) {
                    let theta = Math.atan2(c.y - y, c.x - x);
                    ctx.moveTo(x, y);
                    ctx.lineTo(c.x - r*Math.cos(theta), c.y - r*Math.sin(theta));
                }
                ctx.stroke();
            }

            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI, true);
            ctx.stroke();
            if (node.isLeaf) {
                ctx.fillStyle = 'rgb(100,100,255)';
            } else {
                ctx.fillStyle = 'rgb(200,200,255)';
            }
            ctx.fill();

            ctx.fillStyle = 'black';
            ctx.fillText(setDisplay(node.value, 2), x, y);

        }
    }

    drawArc(n, isHighlight) {

        let depth = n.depth;
        let fractionStart = n.xStart;
        let fractionWidth = n.xWidth;
        let color = this.genColor(n.value.size);

        if (isHighlight) {
            this._ctxH.clearRect(0, 0, this._w, this._h);
            color = 'deeppink';
        }

        if (fractionWidth <= 0) { return; }
        let r = Math.min(this._w, this._h) / 2 / (this._maxDepth + 2);
        this._arcRadius = r;
        let r1 = r * depth;
        let r2 = r1 + r;
        let startAngle = (1-fractionStart) * Math.PI * 2;
        let endAngle = (startAngle - fractionWidth*Math.PI*2) % (2*Math.PI);
        if (fractionWidth === 1) {
            startAngle = 0;
            endAngle = 2 * Math.PI;
        }
        let caStart = Math.cos(startAngle);
        let saStart = Math.sin(startAngle);
        let caEnd = Math.cos(endAngle);
        let saEnd = Math.sin(endAngle);

        // Center (x0, y0)
        let x0 = (this._w - 1) / 2;
        let y0 = (this._h - 1) / 2;
        
        // Inner arc (x1, y1), (x2, y2)
        let x1 = x0 + r1 * caStart;
        let y1 = y0 + r1 * saStart;
        let x2 = x0 + r1 * caEnd;
        let y2 = y0 + r1 * saEnd;

        // Outer arc (x3, y3), (x4, y4)
        let x3 = x0 + r2 * caEnd;
        let y3 = y0 + r2 * saEnd;
        let x4 = x0 + r2 * caStart;
        let y4 = y0 + r2 * saStart;

        let ctx = isHighlight ? this._ctxH : this._ctx;
        ctx.fillStyle = color;
        ctx.strokeStyle = 'black';

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.arc(x0, y0, r1, startAngle, endAngle, true);
        ctx.lineTo(x3, y3);
        ctx.arc(x0, y0, r2, endAngle, startAngle, false);
        ctx.closePath();
        ctx.fill();
        if (depth > 0) {
            ctx.stroke();
        }
    }

    genColor(numValues, maxValues=10) {
        numValues += 2;
        let xR = numValues / 2;
        let xG = numValues / 5;
        let xB = numValues / 15;
        return `rgb(${Math.floor(xR*255)},${Math.floor(xG*255)},${Math.floor(xB*255)})`;
    }

    renderStar() {
        let ctx = this._ctx;
        ctx.clearRect(0, 0, this._w, this._h);

        let q = [this._forrest];
        this.drawArc(q[0]);


        while (q.length) {
            let node = q.shift();
            let x = node.x;
            let y = node.y;
            let d = node.depth;

            let start = node.xStart;
            for (let i = 0; i < node.children.length; i++) {
                let c = node.children[i];
                q.push(c);
                let dw = c.xWidth;
                c.xStart = start;
                this.drawArc(c);
                start += dw;
            }
        }
    }
}

let nodeMove = (x, y) => {
    let n = sv.nodeAt(x, y);
    if (n) {
        let r = RADIUS;
        tip.innerHTML = setDisplay(n.value) + '<br>' + setDisplay(sv.nodeValueAbove(n));
        tip.style.setProperty('top', `${n.y+r+10}px`);
        tip.style.setProperty('left', `${n.x+r+10}px`);
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
    let canvas = document.getElementById('setsViz');
    let canvasH = document.getElementById('setsVizH');
    let ctx = canvas.getContext("2d");
    let ctxH = canvasH.getContext("2d");
    canvas.style.setProperty('position', 'absolute');
    canvasH.style.setProperty('position', 'absolute');
 
    let sv = new SetsViz(ctx, ctxH, canvas.width, canvas.height);
    sv.updateData(setsGen.sets);
    sv.renderStar();

    let tip = document.getElementById('tip');
    tip.style.setProperty('position', 'absolute');
    document.body.style.setProperty('margin', '0px');
    document.onmousemove = e => {
        let x = e.clientX - canvas.offsetLeft;
        let y = e.clientY - canvas.offsetTop;
        let n = sv.arcAt(x, y);
        if (n) {
            sv.drawArc(n, true);
            tip.innerHTML = setDisplay(n.value);
            tip.style.setProperty('top', `${y+20}px`);
            tip.style.setProperty('left', `${x+5}px`);
        } else {
            tip.innerHTML = '';
        }
    };

    document.onclick = e => {
        let x = e.clientX - canvas.offsetLeft;
        let y = e.clientY - canvas.offsetTop;
        let n = sv.arcAt(x, y);
        if (n) {
            sv.setFilter(n.value);
            sv.renderStar();
            console.log(sv._sets);
        }
    };
};
