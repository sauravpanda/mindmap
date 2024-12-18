import type { MindMapNode, NodePosition } from '../../types/mindmap.types';
import { calculateOptimalRadius } from './calculations';
import { calculateChildAngles } from './angleCalculations';
import { calculateNodeCoordinates, calculateControlPoints } from './coordinates';

export function calculateNodePositions(
  root: MindMapNode,
  containerWidth: number,
  containerHeight: number
): Map<string, NodePosition> {
  // Return empty map if dimensions are invalid
  if (!isFinite(containerWidth) || !isFinite(containerHeight) || 
      containerWidth <= 0 || containerHeight <= 0) {
    return new Map();
  }

  const positions = new Map<string, NodePosition>();
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const baseRadius = calculateOptimalRadius(root, containerWidth, containerHeight);

  function layoutLevel(
    node: MindMapNode,
    level: number,
    startAngle: number,
    endAngle: number
  ) {
    const angleStep = (endAngle - startAngle) / (node.children.length || 1);
    const currentAngle = (startAngle + endAngle) / 2;
    
    // Adjust radius based on level with a more gradual increase
    const radius = baseRadius * (level === 0 ? 0 : 0.8 + (level * 0.4));
    
    const coords = calculateNodeCoordinates(centerX, centerY, radius, currentAngle);
    
    // Only set position if coordinates are valid
    if (isFinite(coords.x) && isFinite(coords.y)) {
      positions.set(node.title, { 
        x: coords.x, 
        y: coords.y, 
        level, 
        node 
      });

      if (node.children.length > 0) {
        const childAngles = calculateChildAngles(currentAngle, angleStep, node.children.length);
        node.children.forEach((child, index) => {
          const { startAngle: childStartAngle, endAngle: childEndAngle } = childAngles[index];
          layoutLevel(child, level + 1, childStartAngle, childEndAngle);
        });
      }
    }
  }

  layoutLevel(root, 0, -Math.PI / 2, Math.PI * 1.5);
  return positions;
}

export { calculateControlPoints } from './coordinates';