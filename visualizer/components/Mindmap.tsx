import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { parseMindmapData } from '../utils/parseMindmapData';
import { Button } from '@/components/ui/button';

interface MindmapProps {
  data: string;
}

const Mindmap: React.FC<MindmapProps> = ({ data }) => {
  const [root, setRoot] = useState(parseMindmapData(data));
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleNode = (node: MindmapNode) => {
    node.isExpanded = !node.isExpanded;
    setRoot({ ...root });
  };

  const renderNode = (node: MindmapNode, level: number) => {
    const backgroundColor = `hsl(${level * 60}, 70%, 60%)`;

    return (
      <motion.div
        key={node.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        style={{
          marginLeft: `${level * 40}px`,
          backgroundColor,
          borderRadius: '8px',
          padding: '8px',
          marginBottom: '8px',
          cursor: 'pointer',
        }}
        onClick={() => toggleNode(node)}
      >
        <div className="font-semibold">{node.content}</div>
        <AnimatePresence>
          {node.isExpanded && node.children.map(child => renderNode(child, level + 1))}
        </AnimatePresence>
      </motion.div>
    );
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        setZoom(prevZoom => Math.min(Math.max(prevZoom - e.deltaY * 0.001, 0.5), 2));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="flex justify-end mb-4 gap-2">
        <Button onClick={() => setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5))}>
          <ZoomOut className="w-4 h-4 mr-2" /> Zoom Out
        </Button>
        <Button onClick={() => setZoom(prevZoom => Math.min(prevZoom + 0.1, 2))}>
          <ZoomIn className="w-4 h-4 mr-2" /> Zoom In
        </Button>
      </div>
      <div
        ref={containerRef}
        className="w-full h-full overflow-auto p-4"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          transition: 'transform 0.3s ease-out',
        }}
      >
        {renderNode(root, 0)}
      </div>
    </div>
  );
};

export default Mindmap;

