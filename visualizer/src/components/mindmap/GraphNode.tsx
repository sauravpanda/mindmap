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
        className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-200
          ${level === 0 ? 'bg-blue-500 text-white text-lg font-semibold' : 'bg-white border-2 hover:shadow-lg'}
          ${showTooltip ? 'scale-110' : 'scale-100'}`}
        style={{
          borderColor: getColorForLevel(level),
          borderWidth: '2px',
          whiteSpace: 'nowrap',
          zIndex: showTooltip ? 9999 : 10,
          minWidth: level === 0 ? '200px' : '160px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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