interface MindmapNode {
  id: string;
  content: string;
  children: MindmapNode[];
}

export function parseMindmapData(data: string): MindmapNode {
  const lines = data.split('\n');
  const root: MindmapNode = { id: '0', content: '', children: [] };
  const stack: MindmapNode[] = [root];

  lines.forEach((line, index) => {
    const level = line.match(/^\|*-*/)?.[0].length ?? 0;
    const content = line.replace(/^\|*-*/, '').trim();

    if (level === 0) {
      root.content = content;
    } else {
      const node: MindmapNode = { id: index.toString(), content, children: [] };
      while (stack.length > level) {
        stack.pop();
      }
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    }
  });

  return root;
}

