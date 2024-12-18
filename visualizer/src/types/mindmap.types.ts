export interface MindMapNode {
  title: string;
  description?: string;
  children: MindMapNode[];
}

export interface ParsedLine {
  level: number;
  content: string;
}

export interface NodePosition {
  x: number;
  y: number;
  level: number;
  node: MindMapNode;
}