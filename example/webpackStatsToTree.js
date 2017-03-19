const createFromNamespace = (node, namespace, size) => {
    let name = namespace
        .replace(/\.\//g, '')
        .replace(/~/g, 'node_modules');
    let dirs = name.split('/');
    let searchNode = node;
    dirs.forEach((dir, i) => {
        if (i === dirs.length - 1) {
            return;
        }
        if (!searchNode.children[dir]) {
            searchNode.children[dir] = {
                name: dir,
                children: {},
            };
        }
        searchNode = searchNode.children[dir];
    });

    let last = dirs[dirs.length - 1];
    searchNode.children[last] = {
        name: last,
        children: {},
        weight: size,
    };
};

const childrenToArray = (node) => {
    node.children = Object.keys(node.children).map(key => node.children[key]);
    node.children.forEach(c => childrenToArray(c));
};

const sumWeight = (node) => {
    let weight = node.weight || 0;
    node.children.forEach((c) => {
        weight += sumWeight(c);
    });
    node.weight = weight;
    return weight;
};

const modulesToTree = (rootNode, modules) => {
    modules.forEach((module) => {
        createFromNamespace(rootNode, module.name, module.size);
    });
};

module.exports = (stats) => {
    let rootNode = {
        name: 'total',
        children: {},
    };

    let modules = stats.modules;
    modulesToTree(rootNode, modules);
    childrenToArray(rootNode);
    sumWeight(rootNode);

    return rootNode;
};
