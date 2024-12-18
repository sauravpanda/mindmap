import type { MindMapNode } from '../../types/mindmap.types';

export function getLevelCounts(node: MindMapNode, level: number, counts: number[]): void {
  if (!counts[level]) counts[level] = 0;
  counts[level]++;
  node.children.forEach(child => getLevelCounts(child, level + 1, counts));
}

export function calculateOptimalRadius(
  root: MindMapNode, 
  containerWidth: number, 
  containerHeight: number,
  minSpacing: number = 150
): number {
  // Ensure valid dimensions
  const width = Math.max(containerWidth || 0, minSpacing * 2);
  const height = Math.max(containerHeight || 0, minSpacing * 2);

  const levelCounts: number[] = [];
  getLevelCounts(root, 0, levelCounts);
  
  const maxNodesAtLevel = Math.max(...levelCounts, 1);
  const circumference = maxNodesAtLevel * minSpacing;
  const radiusFromNodes = circumference / (2 * Math.PI);
  
  // Use a smaller percentage for larger screens
  const scaleFactor = Math.min(width, height) > 1200 ? 0.3 : 0.35;
  const containerRadius = Math.min(width, height) * scaleFactor;
  
  return Math.min(radiusFromNodes, containerRadius);
}