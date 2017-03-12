/* eslint-disable */

let flare = {
 name: 'flare',
 children: [
  {
   name: 'analytics',
   children: [
    {
     name: 'cluster',
     children: [
      {name: 'AgglomerativeCluster', weight: 3938},
      {name: 'CommunityStructure', weight: 3812},
      {name: 'HierarchicalCluster', weight: 6714},
      {name: 'MergeEdge', weight: 743}
     ]
    },
    {
     name: 'graph',
     children: [
      {name: 'BetweennessCentrality', weight: 3534},
      {name: 'LinkDistance', weight: 5731},
      {name: 'MaxFlowMinCut', weight: 7840},
      {name: 'ShortestPaths', weight: 5914},
      {name: 'SpanningTree', weight: 3416}
     ]
    },
    {
     name: 'optimization',
     children: [
      {name: 'AspectRatioBanker', weight: 7074}
     ]
    }
   ]
  },
  {
   name: 'animate',
   children: [
    {name: 'Easing', weight: 17010},
    {name: 'FunctionSequence', weight: 5842},
    {
     name: 'interpolate',
     children: [
      {name: 'ArrayInterpolator', weight: 1983},
      {name: 'ColorInterpolator', weight: 2047},
      {name: 'DateInterpolator', weight: 1375},
      {name: 'Interpolator', weight: 8746},
      {name: 'MatrixInterpolator', weight: 2202},
      {name: 'NumberInterpolator', weight: 1382},
      {name: 'ObjectInterpolator', weight: 1629},
      {name: 'PointInterpolator', weight: 1675},
      {name: 'RectangleInterpolator', weight: 2042}
     ]
    },
    {name: 'ISchedulable', weight: 1041},
    {name: 'Parallel', weight: 5176},
    {name: 'Pause', weight: 449},
    {name: 'Scheduler', weight: 5593},
    {name: 'Sequence', weight: 5534},
    {name: 'Transition', weight: 9201},
    {name: 'Transitioner', weight: 19975},
    {name: 'TransitionEvent', weight: 1116},
    {name: 'Tween', weight: 6006}
   ]
  },
  {
   name: 'data',
   children: [
    {
     name: 'converters',
     children: [
      {name: 'Converters', weight: 721},
      {name: 'DelimitedTextConverter', weight: 4294},
      {name: 'GraphMLConverter', weight: 9800},
      {name: 'IDataConverter', weight: 1314},
      {name: 'JSONConverter', weight: 2220}
     ]
    },
    {name: 'DataField', weight: 1759},
    {name: 'DataSchema', weight: 2165},
    {name: 'DataSet', weight: 586},
    {name: 'DataSource', weight: 3331},
    {name: 'DataTable', weight: 772},
    {name: 'DataUtil', weight: 3322}
   ]
  },
  {
   name: 'display',
   children: [
    {name: 'DirtySprite', weight: 8833},
    {name: 'LineSprite', weight: 1732},
    {name: 'RectSprite', weight: 3623},
    {name: 'TextSprite', weight: 10066}
   ]
  },
  {
   name: 'flex',
   children: [
    {name: 'FlareVis', weight: 4116}
   ]
  },
  {
   name: 'physics',
   children: [
    {name: 'DragForce', weight: 1082},
    {name: 'GravityForce', weight: 1336},
    {name: 'IForce', weight: 319},
    {name: 'NBodyForce', weight: 10498},
    {name: 'Particle', weight: 2822},
    {name: 'Simulation', weight: 9983},
    {name: 'Spring', weight: 2213},
    {name: 'SpringForce', weight: 1681}
   ]
  },
  {
   name: 'query',
   children: [
    {name: 'AggregateExpression', weight: 1616},
    {name: 'And', weight: 1027},
    {name: 'Arithmetic', weight: 3891},
    {name: 'Average', weight: 891},
    {name: 'BinaryExpression', weight: 2893},
    {name: 'Comparison', weight: 5103},
    {name: 'CompositeExpression', weight: 3677},
    {name: 'Count', weight: 781},
    {name: 'DateUtil', weight: 4141},
    {name: 'Distinct', weight: 933},
    {name: 'Expression', weight: 5130},
    {name: 'ExpressionIterator', weight: 3617},
    {name: 'Fn', weight: 3240},
    {name: 'If', weight: 2732},
    {name: 'IsA', weight: 2039},
    {name: 'Literal', weight: 1214},
    {name: 'Match', weight: 3748},
    {name: 'Maximum', weight: 843},
    {
     name: 'methods',
     children: [
      {name: 'add', weight: 593},
      {name: 'and', weight: 330},
      {name: 'average', weight: 287},
      {name: 'count', weight: 277},
      {name: 'distinct', weight: 292},
      {name: 'div', weight: 595},
      {name: 'eq', weight: 594},
      {name: 'fn', weight: 460},
      {name: 'gt', weight: 603},
      {name: 'gte', weight: 625},
      {name: 'iff', weight: 748},
      {name: 'isa', weight: 461},
      {name: 'lt', weight: 597},
      {name: 'lte', weight: 619},
      {name: 'max', weight: 283},
      {name: 'min', weight: 283},
      {name: 'mod', weight: 591},
      {name: 'mul', weight: 603},
      {name: 'neq', weight: 599},
      {name: 'not', weight: 386},
      {name: 'or', weight: 323},
      {name: 'orderby', weight: 307},
      {name: 'range', weight: 772},
      {name: 'select', weight: 296},
      {name: 'stddev', weight: 363},
      {name: 'sub', weight: 600},
      {name: 'sum', weight: 280},
      {name: 'update', weight: 307},
      {name: 'variance', weight: 335},
      {name: 'where', weight: 299},
      {name: 'xor', weight: 354},
      {name: '_', weight: 264}
     ]
    },
    {name: 'Minimum', weight: 843},
    {name: 'Not', weight: 1554},
    {name: 'Or', weight: 970},
    {name: 'Query', weight: 13896},
    {name: 'Range', weight: 1594},
    {name: 'StringUtil', weight: 4130},
    {name: 'Sum', weight: 791},
    {name: 'Variable', weight: 1124},
    {name: 'Variance', weight: 1876},
    {name: 'Xor', weight: 1101}
   ]
  },
  {
   name: 'scale',
   children: [
    {name: 'IScaleMap', weight: 2105},
    {name: 'LinearScale', weight: 1316},
    {name: 'LogScale', weight: 3151},
    {name: 'OrdinalScale', weight: 3770},
    {name: 'QuantileScale', weight: 2435},
    {name: 'QuantitativeScale', weight: 4839},
    {name: 'RootScale', weight: 1756},
    {name: 'Scale', weight: 4268},
    {name: 'ScaleType', weight: 1821},
    {name: 'TimeScale', weight: 5833}
   ]
  },
  {
   name: 'util',
   children: [
    {name: 'Arrays', weight: 8258},
    {name: 'Colors', weight: 10001},
    {name: 'Dates', weight: 8217},
    {name: 'Displays', weight: 12555},
    {name: 'Filter', weight: 2324},
    {name: 'Geometry', weight: 10993},
    {
     name: 'heap',
     children: [
      {name: 'FibonacciHeap', weight: 9354},
      {name: 'HeapNode', weight: 1233}
     ]
    },
    {name: 'IEvaluable', weight: 335},
    {name: 'IPredicate', weight: 383},
    {name: 'IValueProxy', weight: 874},
    {
     name: 'math',
     children: [
      {name: 'DenseMatrix', weight: 3165},
      {name: 'IMatrix', weight: 2815},
      {name: 'SparseMatrix', weight: 3366}
     ]
    },
    {name: 'Maths', weight: 17705},
    {name: 'Orientation', weight: 1486},
    {
     name: 'palette',
     children: [
      {name: 'ColorPalette', weight: 6367},
      {name: 'Palette', weight: 1229},
      {name: 'ShapePalette', weight: 2059},
      {name: 'SizePalette', weight: 2291}
     ]
    },
    {name: 'Property', weight: 5559},
    {name: 'Shapes', weight: 19118},
    {name: 'Sort', weight: 6887},
    {name: 'Stats', weight: 6557},
    {name: 'Strings', weight: 22026}
   ]
  },
  {
   name: 'vis',
   children: [
    {
     name: 'axis',
     children: [
      {name: 'Axes', weight: 1302},
      {name: 'Axis', weight: 24593},
      {name: 'AxisGridLine', weight: 652},
      {name: 'AxisLabel', weight: 636},
      {name: 'CartesianAxes', weight: 6703}
     ]
    },
    {
     name: 'controls',
     children: [
      {name: 'AnchorControl', weight: 2138},
      {name: 'ClickControl', weight: 3824},
      {name: 'Control', weight: 1353},
      {name: 'ControlList', weight: 4665},
      {name: 'DragControl', weight: 2649},
      {name: 'ExpandControl', weight: 2832},
      {name: 'HoverControl', weight: 4896},
      {name: 'IControl', weight: 763},
      {name: 'PanZoomControl', weight: 5222},
      {name: 'SelectionControl', weight: 7862},
      {name: 'TooltipControl', weight: 8435}
     ]
    },
    {
     name: 'data',
     children: [
      {name: 'Data', weight: 20544},
      {name: 'DataList', weight: 19788},
      {name: 'DataSprite', weight: 10349},
      {name: 'EdgeSprite', weight: 3301},
      {name: 'NodeSprite', weight: 19382},
      {
       name: 'render',
       children: [
        {name: 'ArrowType', weight: 698},
        {name: 'EdgeRenderer', weight: 5569},
        {name: 'IRenderer', weight: 353},
        {name: 'ShapeRenderer', weight: 2247}
       ]
      },
      {name: 'ScaleBinding', weight: 11275},
      {name: 'Tree', weight: 7147},
      {name: 'TreeBuilder', weight: 9930}
     ]
    },
    {
     name: 'events',
     children: [
      {name: 'DataEvent', weight: 2313},
      {name: 'SelectionEvent', weight: 1880},
      {name: 'TooltipEvent', weight: 1701},
      {name: 'VisualizationEvent', weight: 1117}
     ]
    },
    {
     name: 'legend',
     children: [
      {name: 'Legend', weight: 20859},
      {name: 'LegendItem', weight: 4614},
      {name: 'LegendRange', weight: 10530}
     ]
    },
    {
     name: 'operator',
     children: [
      {
       name: 'distortion',
       children: [
        {name: 'BifocalDistortion', weight: 4461},
        {name: 'Distortion', weight: 6314},
        {name: 'FisheyeDistortion', weight: 3444}
       ]
      },
      {
       name: 'encoder',
       children: [
        {name: 'ColorEncoder', weight: 3179},
        {name: 'Encoder', weight: 4060},
        {name: 'PropertyEncoder', weight: 4138},
        {name: 'ShapeEncoder', weight: 1690},
        {name: 'SizeEncoder', weight: 1830}
       ]
      },
      {
       name: 'filter',
       children: [
        {name: 'FisheyeTreeFilter', weight: 5219},
        {name: 'GraphDistanceFilter', weight: 3165},
        {name: 'VisibilityFilter', weight: 3509}
       ]
      },
      {name: 'IOperator', weight: 1286},
      {
       name: 'label',
       children: [
        {name: 'Labeler', weight: 9956},
        {name: 'RadialLabeler', weight: 3899},
        {name: 'StackedAreaLabeler', weight: 3202}
       ]
      },
      {
       name: 'layout',
       children: [
        {name: 'AxisLayout', weight: 6725},
        {name: 'BundledEdgeRouter', weight: 3727},
        {name: 'CircleLayout', weight: 9317},
        {name: 'CirclePackingLayout', weight: 12003},
        {name: 'DendrogramLayout', weight: 4853},
        {name: 'ForceDirectedLayout', weight: 8411},
        {name: 'IcicleTreeLayout', weight: 4864},
        {name: 'IndentedTreeLayout', weight: 3174},
        {name: 'Layout', weight: 7881},
        {name: 'NodeLinkTreeLayout', weight: 12870},
        {name: 'PieLayout', weight: 2728},
        {name: 'RadialTreeLayout', weight: 12348},
        {name: 'RandomLayout', weight: 870},
        {name: 'StackedAreaLayout', weight: 9121},
        {name: 'TreeMapLayout', weight: 9191}
       ]
      },
      {name: 'Operator', weight: 2490},
      {name: 'OperatorList', weight: 5248},
      {name: 'OperatorSequence', weight: 4190},
      {name: 'OperatorSwitch', weight: 2581},
      {name: 'SortOperator', weight: 2023}
     ]
    },
    {name: 'Visualization', weight: 16540}
   ]
  }
 ]
};

function fillWeight(node) {
    let w = 0;
    for (let i = 0; node.children && i < node.children.length; i++) {
        let c = node.children[i];
        w += fillWeight(c);
    }
    node.weight = node.weight || w;
    return node.weight || 0;
}

fillWeight(flare);

module.exports = flare;