import type { MindMapNode, NodePosition } from '../../types/mindmap.types';

interface TreeNode {
  node: MindMapNode;
  x: number;
  y: number;
  level: number;
  children: TreeNode[];
}

interface LayoutConfig {
  verticalSpacing: number;
  horizontalSpacing: number;
  minNodeDistance: number;
}

function calculateSpacing(width: number, height: number): LayoutConfig {
  const baseSize = Math.min(width, height);
  return {
    verticalSpacing: Math.max(150, baseSize * 0.12),
    horizontalSpacing: Math.max(250, baseSize * 0.25),
    minNodeDistance: Math.max(50, baseSize * 0.1)
  };
}

export function calculateTreeLayout(
  root: MindMapNode,
  width: number,
  height: number
): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();
  const spacing = calculateSpacing(width, height);
  
  // First pass: Calculate depths and identify leaf nodes
  function calculateDepth(node: MindMapNode): number {
    if (node.children.length === 0) return 0;
    return 1 + Math.max(...node.children.map(calculateDepth));
  }
  
  const maxDepth = calculateDepth(root);
  
  // Second pass: Position nodes from leaves to root
  function positionNodes(
    node: MindMapNode,
    level: number,
    startY: number,
    availableHeight: number,
    siblingIndex: number = 0,
    totalSiblings: number = 1
  ): { y: number; height: number } {
    if (node.children.length === 0) {
      // Add extra spacing between different parent groups
      const siblingOffset = (siblingIndex / totalSiblings) * spacing.verticalSpacing;
      const y = startY + (availableHeight / 2) + siblingOffset;
      
      positions.set(node.title, {
        x: (level * spacing.horizontalSpacing) + spacing.horizontalSpacing,
        y,
        level,
        node
      });
      return { y, height: spacing.minNodeDistance };
    }

    // Calculate total height with extra padding between cousin groups
    const childrenHeights = node.children.map(child => {
      const childNodes = countNodes(child);
      return childNodes * spacing.minNodeDistance;
    });
    
    const totalChildrenHeight = Math.max(
      sum(childrenHeights) + (spacing.verticalSpacing * (node.children.length - 1)),
      spacing.minNodeDistance * node.children.length
    );

    // Position children with extra spacing between cousin groups
    let currentY = startY;
    const childrenCenters: number[] = [];
    
    node.children.forEach((child, index) => {
      const childHeight = (availableHeight * childrenHeights[index]) / totalChildrenHeight;
      const result = positionNodes(
        child,
        level + 1,
        currentY,
        childHeight,
        index,
        node.children.length
      );
      childrenCenters.push(result.y);
      currentY += childHeight + spacing.verticalSpacing * 1.5;
    });

    // Position parent at the center of its children - now starting from left side
    const nodeY = average(childrenCenters);
    positions.set(node.title, {
      x: (level * spacing.horizontalSpacing) + spacing.horizontalSpacing,
      y: nodeY,
      level,
      node
    });

    return { y: nodeY, height: totalChildrenHeight };
  }

  // Helper functions
  function countNodes(node: MindMapNode): number {
    return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0);
  }

  function sum(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0);
  }

  function average(numbers: number[]): number {
    return sum(numbers) / numbers.length;
  }

  // Start layout from root
  positionNodes(root, 0, spacing.verticalSpacing, height - (spacing.verticalSpacing * 2));

  // Center the entire layout horizontally
  const minX = Math.min(...Array.from(positions.values()).map(p => p.x));
  const maxX = Math.max(...Array.from(positions.values()).map(p => p.x));
  const layoutWidth = maxX - minX;
  const xOffset = (width - layoutWidth) / 2;

  // Apply horizontal centering
  for (const pos of positions.values()) {
    pos.x = pos.x - minX + xOffset;
  }

  return positions;
}