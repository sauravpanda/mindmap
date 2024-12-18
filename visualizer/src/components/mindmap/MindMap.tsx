import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import type { MindMapNode } from '../../types/mindmap.types';
import { GraphNode } from './GraphNode';
import { calculateTreeLayout } from '../../utils/layoutUtils/treeLayout';
import { NodePosition } from '../../types/mindmap.types';
import { ConnectionLines } from './ConnectionLines';

interface MindMapProps {
  node: MindMapNode;
}

export function MindMap({ node }: MindMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Map<string, NodePosition>>(new Map());
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  // Add zoom state
  const [scale, setScale] = useState(1);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const width = Math.max(rect.width, 100);
      const height = Math.max(rect.height, 100);
      
      if (width > 0 && height > 0) {
        // Increase spacing by adjusting the layout calculation
        const padding = Math.min(width, height) * 0.15; // 15% padding
        const newPositions = calculateTreeLayout(
          node, 
          width - padding * 2, 
          height - padding * 2,
        );
        setPositions(newPositions);
      }
    }
  }, [node]);

  // Handle dragging
  const bind = useDrag(({ offset: [ox, oy], first }) => {
    if (first) {
      const currentX = x.get();
      const currentY = y.get();
      api.start({ x: currentX, y: currentY, immediate: true });
    }
    api.start({ x: ox, y: oy });
  });

  // Handle zooming with mouse wheel
  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY;
    setScale(current => {
      const newScale = current - delta * 0.001;
      return Math.min(Math.max(0.5, newScale), 2); // Limit scale between 0.5 and 2
    });
  }, []);

  useEffect(() => {
    updateDimensions();
    const handleResize = () => updateDimensions();
    window.addEventListener('resize', handleResize);
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [updateDimensions, handleWheel]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[600px] bg-gray-800 overflow-hidden rounded-xl cursor-grab active:cursor-grabbing"
    >
      <animated.div
        {...bind()}
        style={{
          x,
          y,
          scale,
          touchAction: 'none',
          position: 'absolute',
          width: '100%',
          height: '100%'
        }}
      >
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
      </animated.div>
    </div>
  );
}