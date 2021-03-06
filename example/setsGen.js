const LYNX = require('./lynxText');
const constitution = require('./constitution');

// const SIMPLE_SET = [['A'], ['B'], ['C'], ['D']];

// dumb seedable RNG
let randX = 838348234;
const rand = () => {
    randX = (randX * 1664525 + 1013904223) % 2e32;
    return randX / 2e32;
};

const letterGen = (numSets, numElements) => {
    const ALPHAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const probMin = 0;
    const probMax = 1;

    let sets = [];
    let map = {};
    for (let i = 0; i < numSets; i++) {
        let set = [];
        for (let k = 0; k < numElements; k++) {
            let prob = probMin + (probMax - probMin) * k / (numElements - 1);
            if (Math.pow(prob, 15) > rand()) {
                set.push(`${ALPHAS[k % ALPHAS.length]}:${Math.floor(k / ALPHAS.length)}`);
            }
        }
        let hash = [...set].sort().join('');
        if (!map[hash]) {
            map[hash] = true;
            sets.push(set);
        }
    }
    return sets;
};

const sentenceSets = (text) => {
    let sentence = text
        .toLowerCase()
        .replace(/[^a-z0-9.\s]/g, '')
        .split('.');
    let sets = [];
    sentence.forEach((s) => {
        sets.push(s.split(' '));
    });
    return sets;
};


module.exports = {
    lynx: sentenceSets(LYNX),
    constitution: sentenceSets(constitution),
    smallSets: letterGen(100, 100),
    largeSets: letterGen(500, 500),
    xlargeSets: letterGen(10000, 150),
};
