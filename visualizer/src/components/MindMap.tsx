import React, { useRef, useEffect, useState } from 'react';
import type { MindMapNode } from '../types/mindmap.types';
import { GraphNode } from './GraphNode';
import { calculateNodePositions } from '../utils/layoutUtils';
import { NodePosition } from '../types/mindmap.types';
import { ConnectionLines } from './ConnectionLines';

interface MindMapProps {
  node: MindMapNode;
}

export function MindMap({ node }: MindMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Map<string, NodePosition>>(new Map());
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        setPositions(calculateNodePositions(node, width, height));
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [node]);

  return (
    <div ref={containerRef} className="relative w-full h-[800px] bg-gray-50 overflow-hidden">
      <ConnectionLines positions={positions} />
      {Array.from(positions.entries()).map(([nodeId, pos]) => (
        <GraphNode
          key={nodeId}
          node={pos.node}
          x={pos.x}
          y={pos.y}
          level={pos.level}
        />
      ))}
    </div>
  );
}