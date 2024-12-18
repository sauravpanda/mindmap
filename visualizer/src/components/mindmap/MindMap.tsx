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
  const [scale, setScale] = useState(1);

  // Calculate initial scale to fit all nodes
  const calculateInitialScale = useCallback(() => {
    if (!containerRef.current || positions.size === 0) return 1;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Find the bounds of all nodes
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    positions.forEach((pos) => {
      minX = Math.min(minX, pos.x);
      maxX = Math.max(maxX, pos.x);
      minY = Math.min(minY, pos.y);
      maxY = Math.max(maxY, pos.y);
    });

    // Add padding (30% on each side)
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const widthScale = containerWidth / (contentWidth * 1.2);
    const heightScale = containerHeight / (contentHeight * 1.2);

    // Use the smaller scale to ensure everything fits, but don't go below 0.4
    return Math.max(Math.min(widthScale, heightScale), 0.8);
  }, [positions]);

  // Handle dragging with proper momentum
  const bind = useDrag(({ movement: [mx, my], down }) => {
    api.start({
      x: mx,
      y: my,
      immediate: down
    });
  }, {
    from: () => [x.get(), y.get()],
    bounds: undefined, // Remove bounds to allow free movement
    rubberband: true,
  });

  // Handle zooming with mouse wheel
  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY;
    setScale(current => {
      const newScale = current * (1 - delta * 0.01);
      return Math.min(Math.max(0.4, newScale), 10); // Allow more zoom range
    });
  }, []);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const width = Math.max(rect.width, 100);
      const height = Math.max(rect.height, 100);
      
      if (width > 0 && height > 0) {
        const padding = Math.min(width, height) * 0.1;
        const newPositions = calculateTreeLayout(
          node, 
          width - padding * 2, 
          height - padding * 3,
        );
        setPositions(newPositions);
      }
    }
  }, [node]);

  // Set initial scale after positions are calculated
  useEffect(() => {
    if (positions.size > 0) {
      const initialScale = calculateInitialScale();
      setScale(initialScale);
    }
  }, [positions, calculateInitialScale]);

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
      className="relative w-full h-full bg-gray-800 overflow-hidden rounded-xl cursor-grab active:cursor-grabbing"
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
          height: '100%',
          transformOrigin: '50% 50%'
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
      <button
        className="absolute bottom-4 right-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        onClick={() => {
          setScale(calculateInitialScale());
          api.start({ x: 0, y: 0 });
        }}
      >
        Reset View
      </button>
    </div>
  );
}