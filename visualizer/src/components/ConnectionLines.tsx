import React from 'react';
import { NodePosition } from '../types/mindmap.types';
import { getColorForLevel } from '../utils/colorUtils';

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

          const midX = (pos.x + childPos.x) / 2;
          const midY = (pos.y + childPos.y) / 2;

          return (
            <path
              key={`${nodeId}-${child.title}`}
              d={`M ${pos.x} ${pos.y} 
                  C ${midX} ${pos.y},
                    ${midX} ${childPos.y},
                    ${childPos.x} ${childPos.y}`}
              stroke={getColorForLevel(pos.level)}
              strokeWidth="2"
              fill="none"
              className="transition-all duration-300 ease-in-out"
            />
          );
        });
      })}
    </svg>
  );
}