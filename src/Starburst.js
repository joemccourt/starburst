const Tree = require('./Tree');

// *** color utils *** //
function hexToNormalizedColor(hexString) {
    return {
        r: parseInt(hexString.substring(0, 2), 16) / 255,
        g: parseInt(hexString.substring(2, 4), 16) / 255,
        b: parseInt(hexString.substring(4, 6), 16) / 255,
    };
}


// normal blend mode.  B over A.  alpha [0, 1]
function colorBlend(colorA, colorB, alpha) {
    return {
        r: alpha * colorB.r + (1 - alpha) * colorA.r,
        g: alpha * colorB.g + (1 - alpha) * colorA.g,
        b: alpha * colorB.b + (1 - alpha) * colorA.b,
    };
}

// gradient is an array of {color, position}
// Assumes positions are [0, 1] and in order in array
// and gradient must be at least length 2
// Simple linear, no fancy curving adjustments
function getColorFromLinearGradient(gradient, position) {
    // find adjacent stops
    let stop1 = gradient[0];
    let stop2 = gradient[1];
    let i = 1;
    while (stop2.position <= position && i < gradient.length) {
        stop1 = gradient[i - 1];
        stop2 = gradient[i];
        i++;
    }

    let a = stop1.position;
    let b = stop2.position;
    let alpha = (position - a) / (b - a);

    let colorA = hexToNormalizedColor(stop1.color);
    let colorB = hexToNormalizedColor(stop2.color);

    return colorBlend(colorA, colorB, alpha);
}

const COOL_GRADIENT = [
    {
        color: '1058e0',
        position: 0,
    },
    {
        color: 'd8e5fc',
        position: 1,
    },
];

const WARM_GRADIENT = [
    {
        color: 'e09810',
        position: 0,
    },
    {
        color: 'fcefd8',
        position: 1,
    },
];

const GRAY_GRADIENT = [
    {
        color: '777777',
        position: 0,
    },
    {
        color: 'ffffff',
        position: 1,
    },
];

const RAINBOW_GRADIENT = [
    {
        color: 'ff0000',
        position: 0,
    },
    {
        color: 'ffff00',
        position: 0.166,
    },
    {
        color: '00ff00',
        position: 0.333,
    },
    {
        color: '00ffff',
        position: 0.5,
    },
    {
        color: '0000ff',
        position: 0.677,
    },
    {
        color: 'ff00ff',
        position: 0.833,
    },
    {
        color: 'ff0000',
        position: 1,
    },
];

const gradient = {
    rainbow: RAINBOW_GRADIENT,
    warm: WARM_GRADIENT,
    cool: COOL_GRADIENT,
    gray: GRAY_GRADIENT,
};

// *** end of color utils *** //

class Starburst {
    constructor(canvas, canvasH, w, h) {
        let ctx = canvas.getContext('2d');
        let ctxH = canvasH.getContext('2d');
        this._ctx = ctx;
        this._ctxH = ctxH;
        this._canvas = canvas;
        this._canvasH = canvasH;
        this._lastPxRatio = 1;
        this.setSize(w, h);
        this.highlightColor = '#ff1493';
        this.gradientName = 'cool';
        this.colorAlgo = 'ByStart';
        this.offsetAngle = 0;
        this.zoom = 1;
        this.alphaH = 1;

        // Create loop to rerender canvas on page scale change
        let watchCanvasScale = () => {
            this._fitCanvas();
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

    setColorFunction(fn) {
        this.genColor = fn;
    }

    // data is an array of sets
    // else assumes it's a tree directly
    setData(data) {
        if (data instanceof Array) {
            this._tree = new Tree(data);
        } else if (data instanceof Object) {
            this._tree = {
                root: data,
            };
            Tree.linkParents(data);
        } else {
            return;
        }

        this.hasData = true;
        this._calPos(this._tree.root);
    }

    clear() {
        this._ctx.clearRect(0, 0, this._w, this._h);
        this._ctxH.clearRect(0, 0, this._w, this._h);
    }

    clearHighlight() {
        this._ctxH.clearRect(0, 0, this._w, this._h);
    }

    // How to stringify node
    static nodeToString(set, maxLength, joinChar = ',') {
        if (!(set instanceof Set)) {
            return set;
        }
        let l = maxLength || set.length;
        let array = [...set].slice(0, l);
        if (set.size > l) {
            array[l - 1] = '...';
        }
        return array.join(joinChar);
    }

    valueToRGBString(v) {
        let color = getColorFromLinearGradient(gradient[this.gradientName], v);
        return `rgb(${Math.floor(color.r * 255)},${Math.floor(color.g * 255)},${Math.floor(color.b * 255)})`;
    }

    genColorByStart(node) {
        let weight = node._normalizedStart;
        return this.valueToRGBString(weight);
    }

    genColorRelative(node) {
        let weight = node._weightStart / (node === this._tree.root ? 1 : node.p.weight);
        return this.valueToRGBString(weight);
    }

    genColorDepth(node) {
        let weight = node._depth / this._maxDepth;
        return this.valueToRGBString(weight);
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
        let depth = Math.floor(dr / r) - q[0]._depth;

        let angle = (Math.atan2(-dy, dx) + this.offsetAngle) % (2 * Math.PI);
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
            if (fraction >= node._normalizedStart &&
                fraction <= (node._normalizedStart + node._normalizedWidth)) {
                if (node._depth === depth) {
                    return node;
                }
                if (node._depth > maxDepth) {
                    maxNode = node;
                    maxDepth = node._depth;
                }
                for (let i = 0; node.children && i < node.children.length; i++) {
                    let c = node.children[i];
                    q.push(c);
                }
            }
        }
        return onlyInside ? undefined : maxNode;
    }

    nodeHover(node) {
        this.clearHighlight();
        this._highlightUpTo(node);
    }

    nodeClick(node) {
        if (!node) { return; }

        let isRoot = node === this._tree.root;
        let newRoot = node;
        if (isRoot && this.lastNode && this.lastNode.p) {
            newRoot = this.lastNode.p;
        }

        this.lastNode = newRoot;
        this._tree.root = newRoot;
        this._calPos(this._tree.root);
        this.render();
    }

    render() {
        this.clear();
        let q = [this._tree.root];
        while (q.length) {
            let node = q.shift();
            this._drawArc(node);
            for (let i = 0; node.children && i < node.children.length; i++) {
                q.push(node.children[i]);
            }
        }
    }

    _fitCanvas() {
        let devicePixelRatio = window.devicePixelRatio || 1;

        if (this._lastPxRatio === devicePixelRatio) { return; }
        this._lastPxRatio = devicePixelRatio;

        this._w = Math.round(this._w0 * devicePixelRatio);
        this._h = Math.round(this._h0 * devicePixelRatio);

        [this._canvas, this._canvasH].forEach((c) => {
            c.width = this._w;
            c.height = this._h;
            c.style.width = `${this._w0}px`;
            c.style.height = `${this._h0}px`;
        });

        if (this.hasData) {
            this.render();
        }
    }

    _calPos(rootNode) {
        this._maxDepth = 0;
        rootNode._depth = 0;
        let q = [rootNode];
        while (q.length) {
            let node = q.shift();
            if (node) {
                if (node._depth > this._maxDepth) {
                    this._maxDepth = node._depth;
                }
                let weightSoFar = 0;
                for (let i = 0; node.children && i < node.children.length; i++) {
                    let c = node.children[i];
                    c._depth = node._depth + 1;
                    c._weightStart = weightSoFar;
                    weightSoFar += c.weight;
                    q.push(c);
                }
            }
        }

        // _normalizedWidth: fraction node takes at its depth for entire tree
        // _normalizedStart: fraction where node starts at its depth
        // where fraction is [0, 1] corresponding to radians [zero, 2pi]
        q = [rootNode];
        while (q.length) {
            let n = q.shift();
            if (n) {
                if (!n.p || n === rootNode) {
                    n._normalizedWidth = 1;
                    n._normalizedStart = 0;
                } else {
                    n._normalizedWidth = n.weight / n.p.weight * n.p._normalizedWidth;
                    n._normalizedStart = n._weightStart / n.p.weight * n.p._normalizedWidth
                        + n.p._normalizedStart;
                }
                for (let i = 0; n.children && i < n.children.length; i++) {
                    q.push(n.children[i]);
                }
            }
        }
    }

    _drawArc(node, isHighlight) {
        let depth = node._depth;
        let fractionStart = node._normalizedStart;
        let fractionWidth = node._normalizedWidth;

        // FIXME: this is strange interface for setting color
        let colorFn = this.genColor || (() => {});
        let color = colorFn(node) || this[`genColor${this.colorAlgo}`](node);

        if (isHighlight) {
            color = this.highlightColor;
        }

        if (fractionWidth <= 0) { return; }
        let r = Math.min(this._w, this._h) / 2 / (this._maxDepth + 2) * this.zoom;
        this._arcRadius = r;
        let r1 = r * depth;
        let r2 = r1 + r;
        let startAngle = (1 - fractionStart) * Math.PI * 2 + this.offsetAngle;
        let endAngle = startAngle - fractionWidth * Math.PI * 2;

        startAngle %= 2 * Math.PI;
        endAngle %= 2 * Math.PI;

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
        // let x2 = x0 + r1 * caEnd;
        // let y2 = y0 + r1 * saEnd;

        // Outer arc (x3, y3), (x4, y4)
        let x3 = x0 + r2 * caEnd;
        let y3 = y0 + r2 * saEnd;
        // let x4 = x0 + r2 * caStart;
        // let y4 = y0 + r2 * saStart;

        let ctx = isHighlight ? this._ctxH : this._ctx;
        ctx.globalAlpha = isHighlight ? this.alphaH : 1;
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

    _highlightUpTo(node) {
        while (node) {
            this._drawArc(node, true);
            if (node === this._tree.root) {
                node = undefined;
            } else {
                node = node.p;
            }
        }
    }
}

module.exports = Starburst;
