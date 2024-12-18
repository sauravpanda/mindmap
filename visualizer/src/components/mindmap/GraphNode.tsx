import React, { useState, useMemo } from 'react';
import type { MindMapNode } from '../../types/mindmap.types';
import { NodeTooltip } from './NodeTooltip';
import { getColorForLevel } from '../../utils/colorUtils';

interface GraphNodeProps {
  node: MindMapNode;
  x: number;
  y: number;
  level: number;
}

export function GraphNode({ node, x, y, level }: GraphNodeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const position = useMemo(() => {
    // Ensure coordinates are valid numbers
    const validX = isFinite(x) ? Math.round(x) : 0;
    const validY = isFinite(y) ? Math.round(y) : 0;
    
    return {
      left: `${validX}px`,
      top: `${validY}px`
    };
  }, [x, y]);

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={position}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
          ${level === 0 ? 'bg-blue-500 text-white' : 'bg-white border-2 hover:shadow-lg'}
          ${showTooltip ? 'scale-110' : 'scale-100'}`}
        style={{
          borderColor: getColorForLevel(level),
          whiteSpace: 'nowrap',
          zIndex: showTooltip ? 9999 : 10
        }}
      >
        {node.title}
      </div>
      {showTooltip && node.description && (
        <NodeTooltip description={node.description} />
      )}
    </div>
  );
}