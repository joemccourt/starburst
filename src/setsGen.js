const LYNX = require('./lynxText').LYNX;
const constitution = require('./constitution');
const SIMPLE_SET = [['A'], ['B'], ['C'], ['D']];

const letterGen = (numSets, numElements) => {
    const ALPHAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const probMin = 0.01;
    const probMax = 0.99;

    let sets = [];
    for (let i = 0; i < numSets; i++) {
        let set = [];
        for (let k = 0; k < numElements; k++) {
            let prob = probMin + (probMax - probMin) * k / (numElements-1);
            if (Math.pow(prob,20) > Math.random()) {
                set.push(ALPHAS[k % ALPHAS.length] + Math.floor(k / ALPHAS.length));
            }
        }
        sets.push(set);
    }
    return sets;
};

const sentenceSets = (text) => {
    let sentence = text
        .toLowerCase()
        .replace(/[^a-z0-9\.\s]/g, '')
        .split('.');
    let sets = [];
    sentence.forEach(s => {
        sets.push(s.split(' '));
    });
    return sets;
};


module.exports = {
    // sets: sentenceSets(constitution)
    sets: letterGen(1000, 1000)
};
