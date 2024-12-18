import React, { useState, useEffect } from 'react';
import { MindMap } from './components/mindmap/MindMap';
import { MindMapInput } from './components/input/MindMapInput';
import { parseInput } from './utils/mindmapParser';
import { getMindMapList, loadMindMap, MindMapMeta } from './services/mindmapService';

function App() {
  const [input, setInput] = useState('');
  const [mindMapData, setMindMapData] = useState(() => parseInput('Empty: Start your mindmap\n|-First Node: Add description'));
  const [availableMindmaps, setAvailableMindmaps] = useState<MindMapMeta[]>([]);
  const [selectedMindmapId, setSelectedMindmapId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAvailableMindmaps();
  }, []);

  const loadAvailableMindmaps = async () => {
    try {
      const mindmaps = await getMindMapList();
      setAvailableMindmaps(mindmaps);
      if (mindmaps.length > 0) {
        await handleSelectMindmap(mindmaps[0].id);
      }
    } catch (error) {
      setError('Failed to load mindmap list');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMindmap = async (mindmapId: string) => {
    try {
      setLoading(true);
      const content = await loadMindMap(mindmapId);
      setInput(content);
      setMindMapData(parseInput(content));
      setSelectedMindmapId(mindmapId);
      setError(null);
    } catch (error) {
      setError('Failed to load mindmap');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    try {
      const data = parseInput(input);
      setMindMapData(data);
      setError(null);
    } catch (error) {
      console.error('Failed to parse mindmap:', error);
      setError('Invalid mindmap format. Please check your input.');
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 p-8 overflow-hidden">
      <div className="h-full max-w-[1400px] mx-auto flex flex-col">
        <h1 className="text-3xl font-bold text-white mb-4 text-center">
          Interactive Mind Map Generator
        </h1>
        
        <div className="flex justify-between items-center mb-4">
          <select
            value={selectedMindmapId}
            onChange={(e) => handleSelectMindmap(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableMindmaps.map((mindmap) => (
              <option key={mindmap.id} value={mindmap.id}>
                {mindmap.name}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => {
              const emptyMindmap = 'Empty: Start your mindmap\n|-First Node: Add description';
              setInput(emptyMindmap);
              setMindMapData(parseInput(emptyMindmap));
              setSelectedMindmapId('');
            }}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Create New
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-[30%,70%] gap-4 flex-1 overflow-hidden">
          <MindMapInput 
            value={input} 
            onChange={setInput} 
            onGenerate={handleGenerate} 
          />
          
          <div className="bg-gray-800 rounded-xl shadow-2xl p-4 overflow-auto">
            <MindMap node={mindMapData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;