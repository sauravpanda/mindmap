import meta from '../data/meta.json';

export interface MindMapMeta {
  id: string;
  name: string;
  description: string;
  file: string;
}

export async function getMindMapList(): Promise<MindMapMeta[]> {
  try {
    return meta.mindmaps;
  } catch (error) {
    console.error('Error loading mindmap list:', error);
    throw new Error('Failed to load mindmap list');
  }
}

export async function loadMindMap(id: string): Promise<string> {
  try {
    const mindmap = meta.mindmaps.find(m => m.id === id);
    if (!mindmap) {
      throw new Error(`Mindmap with id ${id} not found`);
    }

    const response = await fetch(`/src/data/mindmaps/${mindmap.file}`);
    if (!response.ok) {
      throw new Error(`Failed to load mindmap: ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error loading mindmap:', error);
    throw error;
  }
} 