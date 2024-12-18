import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { MindMapNode as MindMapNodeType } from '../types/mindmap.types';
import { NodeDescription } from './NodeDescription';

interface MindMapNodeProps {
  node: MindMapNodeType;
  level?: number;
}

export function MindMapNode({ node, level = 0 }: MindMapNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDescription, setShowDescription] = useState(false);

  const hasChildren = node.children.length > 0;
  const paddingLeft = level * 2;

  return (
    <div className="my-2">
      <div 
        className={`flex items-center space-x-2 p-2 rounded-lg transition-colors
          ${level === 0 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
        style={{ marginLeft: `${paddingLeft}rem` }}
      >
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-200 rounded"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
        
        <div 
          className="relative cursor-pointer"
          onMouseEnter={() => setShowDescription(true)}
          onMouseLeave={() => setShowDescription(false)}
        >
          <span className={`font-medium ${level === 0 ? 'text-lg' : ''}`}>
            {node.title}
          </span>
          
          {node.description && showDescription && (
            <NodeDescription description={node.description} />
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-4 border-l-2 border-gray-200">
          {node.children.map((child, index) => (
            <MindMapNode key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}