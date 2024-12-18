import type { MindMapNode, NodePosition } from '../../types/mindmap.types';

interface TreeNode {
  node: MindMapNode;
  x: number;
  y: number;
  level: number;
  children: TreeNode[];
}

const VERTICAL_SPACING = 80;
const HORIZONTAL_SPACING = 200;

function createTreeStructure(node: MindMapNode, level: number = 0): TreeNode {
  return {
    node,
    x: 0,
    y: 0,
    level,
    children: node.children.map(child => createTreeStructure(child, level + 1))
  };
}

function calculateInitialPositions(tree: TreeNode, x: number = 0, y: number = 0) {
  tree.x = x;
  tree.y = y;
  
  let currentY = y;
  tree.children.forEach((child, index) => {
    calculateInitialPositions(child, x + HORIZONTAL_SPACING, currentY);
    currentY += VERTICAL_SPACING;
  });
}

function centerParents(tree: TreeNode) {
  if (tree.children.length > 0) {
    tree.children.forEach(centerParents);
    const firstChild = tree.children[0];
    const lastChild = tree.children[tree.children.length - 1];
    tree.y = (firstChild.y + lastChild.y) / 2;
  }
}

export function calculateTreeLayout(
  root: MindMapNode,
  width: number,
  height: number
): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();
  const tree = createTreeStructure(root);
  
  // Calculate initial positions
  calculateInitialPositions(tree);
  centerParents(tree);
  
  // Convert tree layout to positions map
  function addToPositions(node: TreeNode) {
    positions.set(node.node.title, {
      x: node.x,
      y: node.y,
      level: node.level,
      node: node.node
    });
    node.children.forEach(addToPositions);
  }
  
  addToPositions(tree);
  
  // Center the entire tree
  const minX = Math.min(...Array.from(positions.values()).map(p => p.x));
  const maxX = Math.max(...Array.from(positions.values()).map(p => p.x));
  const minY = Math.min(...Array.from(positions.values()).map(p => p.y));
  const maxY = Math.max(...Array.from(positions.values()).map(p => p.y));
  
  const treeWidth = maxX - minX;
  const treeHeight = maxY - minY;
  const offsetX = (width - treeWidth) / 2 - minX;
  const offsetY = (height - treeHeight) / 2 - minY;
  
  // Apply offset to center the tree
  for (const pos of positions.values()) {
    pos.x += offsetX;
    pos.y += offsetY;
  }
  
  return positions;
}