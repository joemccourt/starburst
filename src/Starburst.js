const Tree = require('./Tree');

const RADIUS = 18;

// Deafult display text for a set

class Starburst {
    constructor(canvas, canvasH, w, h) {
        let ctx = canvas.getContext("2d");
        let ctxH = canvasH.getContext("2d");
        this._ctx = ctx;
        this._ctxH = ctxH;
        this._canvas = canvas;
        this._canvasH = canvasH;
        this._lastPxRatio = 1;
        this.setSize(w, h);

        // Create loop to rerender canvas on page scale change
        let watchCanvasScale = e => {
            this.fitCanvas();
            window.requestAnimationFrame(watchCanvasScale);
        };
        watchCanvasScale();
    }

    setSize(w, h) {
        this._w = w;
        this._h = h;
        this._w0 = w;
        this._h0 = h;
    }

    // data is an array of sets
    // else assumes it's a tree directly
    setData(data) {
        if (data instanceof Array) {
            this._tree = new Tree(data);
        } else if (data instanceof Object) {
            this._tree = {
                root: data
            };
        } else {
            return;
        }

        this.hasData = true;
        this._calPos(this._tree.root);
    }

    // How to stringify node
    static nodeToString(set, maxLength, joinChar = ',') {
        if (maxLength === undefined) {
            maxLength = set.length;
        }
        let array = [...set].slice(0, maxLength);
        if (set.size > maxLength) {
            array[maxLength - 1] = '...';
        }
        return array.join(joinChar);
    };

    _calPos(rootNode) {
        let maxDepth = 0;
        let q = [{
            n: rootNode,
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
                        d: node.d + 1
                    });
                }
            }
        }
        this._maxDepth = maxDepth;
        let yPadd = 10 + RADIUS;
        let xPadd = RADIUS;

        q = [{
            n: rootNode
        }];
        while (q.length) {
            let n = q.shift().n;
            if (n) {
                let k = numChildrenByDepth[n.depth];
                let x = xPadd + (this._w - 2*xPadd) / k * (n.col+0.5);
                let y = yPadd + (this._h - 2*yPadd) * (n.depth) / (this._maxDepth || 1);
                n.y = y;
                n.x = x;
                n.fractionStart = n.col / k;
                if (!n.p || n === rootNode) {
                    n.xWidth = 1;
                } else {
                    n.xWidth = n.n / n.p.n * n.p.xWidth;
                }
                for (let i = 0; i < n.children.length; i++) {
                    let c = n.children[i];
                    q.push({
                        n: c
                    });
                }
            }
        }
    }

    arcAt(x, y, onlyInside) {
        x *= this._lastPxRatio;
        y *= this._lastPxRatio;
        let q = [this._tree.root];
        let r = this._arcRadius;
        let x0 = (this._w - 1) / 2;
        let y0 = (this._h - 1) / 2;
        let dx = x - x0;
        let dy = y - y0;
        let dr = Math.sqrt(dx * dx + dy * dy);
        let depth = Math.floor(dr / r) - q[0].depth;

        let angle = Math.atan2(-dy, dx);
        let fraction = angle / (Math.PI * 2);
        if (fraction < 0) {
            fraction += 1;
        }

        if (depth === 0) {
            return q[0];
        }

        let maxNode;
        let maxDepth = -1;
        while (q.length) {
            let node = q.shift();
            if (fraction >= node.xStart && fraction <= (node.xStart + node.xWidth)) {
                if (node.depth === depth) {
                    return node;
                }
                if (node.depth > maxDepth) {
                    maxNode = node;
                    maxDepth = node.depth;
                }
                for (let i = 0; i < node.children.length; i++) {
                    let c = node.children[i];
                    q.push(c);
                }
            }
        }
        return onlyInside ? undefined : maxNode;
    }

    nodeHover(node) {
        // TODO: move default tool tip display into here
    }

    nodeClick(node) {
        if (!node) { return; }

        let isRoot = node === this._tree.root;
        if (isRoot && this.lastNode && this.lastNode.p) {
            node = this.lastNode.p;
        }

        this.lastNode = node;
        this._tree.root = node;
        this._calPos(this._tree.root);
        this.render();
    }

    fitCanvas() {
        let ctx = this._ctx;
        let ctxH = this._ctxH;
        let devicePixelRatio = window.devicePixelRatio || 1;

        if (this._lastPxRatio === devicePixelRatio) { return; }
        this._lastPxRatio = devicePixelRatio;

        let oldWidth = this._w;
        let oldHeight = this._h;

        this._w = Math.round(this._w0 * devicePixelRatio);
        this._h = Math.round(this._h0 * devicePixelRatio);

        [this._canvas, this._canvasH].forEach(c => {
            c.width = this._w;
            c.height = this._h;
            c.style.width = `${this._w0}px`;
            c.style.height = `${this._h0}px`;
        });

        if (this.hasData) {
            this.render();
        }
    }

    clearHighlight() {
        this._ctxH.clearRect(0, 0, this._w, this._h);
    }

    drawArc(n, isHighlight) {
        let depth = n.depth;
        let fractionStart = n.xStart;
        let fractionWidth = n.xWidth;
        let color = this.genColor(n.n);

        if (isHighlight) {
            color = 'deeppink';
        }

        if (fractionWidth <= 0) { return; }
        let r = Math.min(this._w, this._h) / 2 / (this._maxDepth + 2);
        this._arcRadius = r;
        let r1 = r * depth;
        let r2 = r1 + r;
        let startAngle = (1 - fractionStart) * Math.PI * 2;
        let endAngle = (startAngle - fractionWidth * Math.PI * 2) % (2 * Math.PI);
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

    highlightUpTo(node) {
        while(node) {
            this.drawArc(node, true);
            if (node === this._tree.root) {
                node = undefined;
            } else {
                node = node.p;
            }
        }
    }

    // TODO: abstract this to callback with node as input
    genColor(numValues, maxValues=10) {
        // numValues += 2;
        let xR = 1 - numValues / 200;
        let xG = 1 - numValues / 500;
        let xB = 1 - numValues / 1500;
        return `rgb(${Math.floor(xR*255)},${Math.floor(xG*255)},${Math.floor(xB*255)})`;
    }

    render() {
        let ctx = this._ctx;
        ctx.clearRect(0, 0, this._w, this._h);
        this._ctxH.clearRect(0, 0, this._w, this._h);

        let q = [this._tree.root];
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

module.exports = Starburst;
