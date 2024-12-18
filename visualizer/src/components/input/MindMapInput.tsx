import React from 'react';

interface MindMapInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
}

export function MindMapInput({ value, onChange, onGenerate }: MindMapInputProps) {
  return (
    <div className="space-y-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-48 p-4 bg-gray-800 text-gray-100 rounded-lg font-mono text-sm resize-y"
        placeholder="Enter your mindmap structure here..."
      />
      <div className="flex justify-end">
        <button
          onClick={onGenerate}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                   transition-colors duration-200 font-medium"
        >
          Generate Mindmap
        </button>
      </div>
    </div>
  );
}