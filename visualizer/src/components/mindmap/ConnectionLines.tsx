import React from 'react';
import { NodePosition } from '../../types/mindmap.types';
import { ConnectionLine } from './ConnectionLine';

interface ConnectionLinesProps {
  positions: Map<string, NodePosition>;
}

export function ConnectionLines({ positions }: ConnectionLinesProps) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {Array.from(positions.entries()).map(([nodeId, pos]) => {
        const nodeData = pos.node;
        return nodeData.children.map((child) => {
          const childPos = positions.get(child.title);
          if (!childPos) return null;

          return (
            <ConnectionLine
              key={`${nodeId}-${child.title}`}
              startX={pos.x}
              startY={pos.y}
              endX={childPos.x}
              endY={childPos.y}
              level={pos.level}
            />
          );
        });
      })}
    </svg>
  );
}