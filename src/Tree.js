const flatCount = (sets) => {
    let counts = {};
    sets.forEach((s) => {
        s.forEach((e) => {
            counts[e] = (counts[e] || 0) + 1;
        });
    });
    return counts;
};

const mapMax = (map) => {
    let max = 0;
    let maxV = '';
    Object.keys(map)
        .forEach((k) => {
            if (map[k] > max) {
                max = map[k];
                maxV = k;
            }
        });
    return maxV;
};

// weight is by default number of children sets plus if is leaf
const DEFAULT_WEIGHT_FN = (node, numChildren) => numChildren + (node.isLeaf ? 1 : 0);

class Tree {
    constructor(sets, weightFn = DEFAULT_WEIGHT_FN) {
        this._sets0 = sets;
        this.weightFn = weightFn;
        this.getTreeFromSets(sets);
    }

    getTreeFromSets(sets) {
        this._sets = new Set();
        for (let i = 0; i < sets.length; i++) {
            let s = new Set(sets[i]);
            s.delete('');
            this._sets.add(s);
        }

        let rootNode = {
            value: new Set(),
            weight: this._sets.size,
            isLeaf: false, // not always true
            children: [],
        };

        this.root = rootNode;
        this._buildTree(rootNode, this._sets, flatCount(this._sets));
        this._linkParents(rootNode);
    }

    // build a trie tree
    _buildTree(parent, sets, countsMap) {
        if (sets.size === 0) {
            return;
        }

        let mostCommonElement = mapMax(countsMap);

        let childrenSets = new Set();
        let sideTrieSets = new Set();

        let childrenCounts = {};
        let sideCounts = {};

        let isLeaf = false;

        sets.forEach((s) => {
            if (s.has(mostCommonElement)) {
                s.delete(mostCommonElement);
                if (s.size > 0) {
                    childrenSets.add(s);
                } else {
                    isLeaf = true;
                }
                s.forEach((e) => {
                    childrenCounts[e] = (childrenCounts[e] || 0) + 1;
                });
            } else if (s.size) {
                sideTrieSets.add(s);
                s.forEach((e) => {
                    sideCounts[e] = (sideCounts[e] || 0) + 1;
                });
            }
        });

        if (parent.children.length > 0 || sideTrieSets.size > 0 || parent.isLeaf) {
            let childTrie = {
                value: new Set([mostCommonElement]),
                p: parent,
                isLeaf,
                children: [],
            };

            // TODO: might want to make this separate tree pass
            childTrie.weight = this.weightFn(childTrie, childrenSets.size);

            parent.children.push(childTrie);
            this._buildTree(childTrie, childrenSets, childrenCounts);
            this._buildTree(parent, sideTrieSets, sideCounts);
        } else {
            parent.value.add(mostCommonElement);
            this._buildTree(parent, childrenSets, childrenCounts);
        }
    }

    _linkParents(node) {
        for (let i = 0; i < node.children.length; i++) {
            let c = node.children[i];
            c.p = node;
            this._linkParents(c);
        }
    }
}

module.exports = Tree;
