import type { MindMapNode } from '../types/mindmap.types';
import { NodePosition } from '../types/mindmap.types';

// Calculate the total number of nodes at each level
function getLevelCounts(node: MindMapNode, level: number, counts: number[]): void {
  if (!counts[level]) counts[level] = 0;
  counts[level]++;
  node.children.forEach(child => getLevelCounts(child, level + 1, counts));
}

// Calculate the optimal radius based on the number of nodes
function calculateOptimalRadius(root: MindMapNode, width: number, height: number): number {
  const levelCounts: number[] = [];
  getLevelCounts(root, 0, levelCounts);
  
  // Find the level with the most nodes
  const maxNodesAtLevel = Math.max(...levelCounts);
  // Calculate minimum space needed between nodes
  const minSpacing = 150; // Minimum pixels between nodes
  
  // Calculate radius based on the level with the most nodes
  const circumference = maxNodesAtLevel * minSpacing;
  const radiusFromNodes = circumference / (2 * Math.PI);
  
  // Use the smaller of the calculated radius or the container-based radius
  const containerRadius = Math.min(width, height) * 0.35;
  return Math.min(radiusFromNodes, containerRadius);
}

export function calculateNodePositions(
  root: MindMapNode,
  width: number,
  height: number
): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();
  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = calculateOptimalRadius(root, width, height);

  function layoutLevel(
    node: MindMapNode,
    level: number,
    startAngle: number,
    endAngle: number
  ) {
    const angleStep = (endAngle - startAngle) / (node.children.length || 1);
    const currentAngle = (startAngle + endAngle) / 2;
    
    // Adjust radius based on level to prevent overcrowding
    const radius = baseRadius * (level === 0 ? 0 : 1 + (level * 0.5));
    
    const x = centerX + Math.cos(currentAngle) * radius;
    const y = centerY + Math.sin(currentAngle) * radius;
    
    positions.set(node.title, { x, y, level, node });

    if (node.children.length > 0) {
      const childAngleSpread = Math.min(Math.PI / 2, angleStep * 0.8);
      node.children.forEach((child, index) => {
        const childStartAngle = currentAngle - childAngleSpread / 2 + (childAngleSpread / (node.children.length - 1)) * index;
        const childEndAngle = childStartAngle + (childAngleSpread / node.children.length);
        layoutLevel(child, level + 1, childStartAngle, childEndAngle);
      });
    }
  }

  layoutLevel(root, 0, -Math.PI / 2, Math.PI * 1.5);
  return positions;
}