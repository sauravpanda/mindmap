import type { MindMapNode, NodePosition } from '../../types/mindmap.types';

interface LayoutConfig {
  verticalSpacing: number;
  horizontalSpacing: number;
  minNodeDistance: number;
}

function calculateSpacing(width: number, height: number): LayoutConfig {
  const baseSize = Math.min(width, height);
  return {
    verticalSpacing: Math.max(5, baseSize * 0.005),
    horizontalSpacing: Math.max(300, baseSize * 0.25),
    minNodeDistance: Math.max(50, baseSize * 0.15)
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
      // Add more spacing between leaf nodes
      const siblingOffset = (siblingIndex / Math.max(1, totalSiblings - 1)) * 
        (availableHeight - spacing.minNodeDistance);
      const y = startY + spacing.minNodeDistance + siblingOffset;
      
      positions.set(node.title, {
        x: (level * spacing.horizontalSpacing),
        y,
        level,
        node
      });
      return { y, height: spacing.minNodeDistance };
    }

    // Calculate total height needed for this subtree
    const childrenHeights = node.children.map(child => {
      const childNodes = countNodes(child);
      // Add extra padding between groups of nodes
      return childNodes * spacing.minNodeDistance * 1.2;
    });
    
    const totalChildrenHeight = Math.max(
      sum(childrenHeights) + (spacing.verticalSpacing * (node.children.length)),
      spacing.minNodeDistance * node.children.length * 1.5
    );

    // Position children with increased spacing
    let currentY = startY;
    const childrenCenters: number[] = [];
    
    node.children.forEach((child, index) => {
      const childHeight = childrenHeights[index];
      // Add extra vertical padding between groups
      const verticalPadding = spacing.verticalSpacing * 
        (index === 0 || index === node.children.length - 1 ? 0.2 : 1);
      
      const result = positionNodes(
        child,
        level + 1,
        currentY + verticalPadding,
        childHeight,
        index,
        node.children.length
      );
      console.log(result, child);
      childrenCenters.push(result.y);
      currentY += childHeight + spacing.verticalSpacing * 1.8; // Increased spacing multiplier
    });

    // Position parent node
    const nodeY = average(childrenCenters);
    positions.set(node.title, {
      x: (level * spacing.horizontalSpacing),
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
  positionNodes(root, 0, 10, height - (spacing.verticalSpacing * 2));

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