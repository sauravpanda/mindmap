'use client'

import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  NodeTypes,
} from 'reactflow'
import dagre from 'dagre'
import 'reactflow/dist/style.css'
import { Button } from '@/components/ui/button'

interface MindmapVisualizerProps {
  data: string
}

// Parse the mindmap data into a tree structure
function parseMindmapData(data: string) {
  const lines = data.split('\n')
  const nodes: Node[] = []
  const edges: Edge[] = []
  let id = 0

  lines.forEach((line, index) => {
    const level = line.match(/^\|*-*/)?.[0].length ?? 0
    const content = line.replace(/^\|*-*/, '').trim()
    const [label, details] = content.split(':').map(s => s.trim())
    const nodeId = `node-${id++}`
    
    nodes.push({
      id: nodeId,
      data: { 
        label, 
        details,
        isRoot: index === 0 
      },
      position: { x: 0, y: 0 }, // Will be calculated by dagre
      type: 'custom',
    })

    if (index > 0) {
      const parentLine = lines
        .slice(0, index)
        .reverse()
        .find(l => (l.match(/^\|*-*/)?.[0].length ?? 0) < level)
      if (parentLine) {
        const parentIndex = lines.indexOf(parentLine)
        edges.push({
          id: `edge-${id}`,
          source: `node-${parentIndex}`,
          target: nodeId,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
          type: 'smoothstep',
        })
      }
    }
  })

  return { nodes, edges }
}

// Use dagre to calculate node positions
function getLayoutedElements(nodes: Node[], edges: Edge[]) {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: 'LR', nodesep: 120, ranksep: 160 })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 80 })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 100,
        y: nodeWithPosition.y - 40,
      },
    }
  })
}

const CustomNode = ({ data }: { data: { label: string; details?: string; isRoot: boolean } }) => {
  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg transition-all duration-200 border-2 w-[200px]
        ${data.isRoot 
          ? 'bg-blue-600 text-white border-blue-400' 
          : 'bg-white text-gray-800 border-gray-200 hover:border-blue-200'
        } group`}
    >
      <div className={`font-bold text-base ${data.isRoot ? 'text-white' : 'text-gray-800'} break-words`}>
        {data.label}
      </div>
      {data.details && (
        <div className={`mt-2 text-sm break-words
          ${data.isRoot ? 'text-white/80' : 'text-gray-500'}`}>
          {data.details}
        </div>
      )}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-transparent !w-2 !h-2 border-2 border-gray-300 !min-w-0" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-transparent !w-2 !h-2 border-2 border-gray-300 !min-w-0" 
      />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export default function MindmapVisualizer({ data }: MindmapVisualizerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onLayout = useCallback(() => {
    const { nodes: parsedNodes, edges: parsedEdges } = parseMindmapData(data)
    const layoutedNodes = getLayoutedElements(parsedNodes, parsedEdges)
    setNodes(layoutedNodes)
    setEdges(parsedEdges)
  }, [data, setNodes, setEdges])

  useEffect(() => {
    onLayout()
  }, [onLayout])

  return (
    <div className="h-[600px] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-[#1B1E27]"
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Background color="#94a3b8" gap={24} />
        <Controls className="!bg-white/10 !rounded-xl" />
      </ReactFlow>
      <Button 
        className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 text-white"
        onClick={() => onLayout()}
      >
        Reset View
      </Button>
    </div>
  )
}

