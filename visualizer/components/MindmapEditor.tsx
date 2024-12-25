'use client'

import { Button } from '@/components/ui/button'

interface MindmapEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function MindmapEditor({ value, onChange }: MindmapEditorProps) {
  return (
    <div className="flex flex-col h-[600px]">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-[#1B1E27] text-white font-mono text-sm p-4 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button 
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white w-full"
        onClick={() => {
          // Trigger visualization update
        }}
      >
        Generate Mindmap
      </Button>
    </div>
  )
}

