import { MindMapNode, ParsedLine } from '../types/mindmap.types';
import { splitTitleAndDescription, countIndentation, cleanLine } from './stringUtils';

function parseLine(line: string, lineNumber: number): ParsedLine {
  if (!line.trim()) {
    throw new Error(`Empty line at line ${lineNumber + 1}`);
  }

  return {
    level: countIndentation(line),
    content: cleanLine(line)
  };
}

function createNode(content: string): MindMapNode {
  const [title, description] = splitTitleAndDescription(content);
  return {
    title,
    description,
    children: [] // Initialize with empty array
  };
}

export function parseInput(input: string): MindMapNode {
  const lines = input.trim().split('\n');
  if (lines.length === 0) {
    throw new Error('Input is empty');
  }

  const root = createNode(cleanLine(lines[0]));
  const nodeStack: MindMapNode[] = [root];
  const levelStack: number[] = [0];

  for (let i = 1; i < lines.length; i++) {
    const { level, content } = parseLine(lines[i], i);
    const node = createNode(content);

    while (levelStack.length > 0 && level <= levelStack[levelStack.length - 1]) {
      nodeStack.pop();
      levelStack.pop();
    }

    if (nodeStack.length === 0) {
      throw new Error(`Invalid structure: node at line ${i + 1} (level ${level}) has no parent`);
    }

    const parent = nodeStack[nodeStack.length - 1];
    parent.children.push(node);
    nodeStack.push(node);
    levelStack.push(level);
  }

  return root;
}