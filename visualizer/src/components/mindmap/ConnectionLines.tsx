import React, { useRef, useEffect } from 'react';
import { NodePosition } from '../../types/mindmap.types';
import { ConnectionLine } from './ConnectionLine';

interface ConnectionLinesProps {
  positions: Map<string, NodePosition>;
}

export function ConnectionLines({ positions }: ConnectionLinesProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    
    // Update SVG viewBox to match container size
    const updateViewBox = () => {
      const svg = svgRef.current;
      if (!svg) return;
      
      const container = svg.parentElement;
      if (!container) return;
      
      const { width, height } = container.getBoundingClientRect();
      svg.setAttribute('width', width.toString());
      svg.setAttribute('height', height.toString());
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    };

    updateViewBox();
    window.addEventListener('resize', updateViewBox);
    return () => window.removeEventListener('resize', updateViewBox);
  }, []);

  return (
    <svg 
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: 'visible' }} // Allow lines to render outside SVG bounds
    >
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