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

class Forrest {
    constructor(sets) {
        this._sets0 = sets;
        this.getForrestFromSets(sets);
    }

    getForrestFromSets(sets) {
        this._sets = new Set();
        for (let i = 0; i < sets.length; i++) {
            let s = new Set(sets[i]);
            s.delete('');
            this._sets.add(s);
        }

        let forrest = {
            value: new Set(),
            depth: 0,
            n: this._sets.size,
            xStart: 0,
            xWidth: 1,
            isLeaf: false,
            children: []
        };

        this.root = forrest;
        this._buildForrest(forrest, this._sets);
        this._linkParents(forrest);
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
}

module.exports = Forrest;
