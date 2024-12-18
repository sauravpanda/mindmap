import React from 'react';

interface NodeTooltipProps {
  description: string;
}

export function NodeTooltip({ description }: NodeTooltipProps) {
  return (
    <div className="absolute z-50 left-1/2 top-full mt-2 -translate-x-1/2">
      <div className="bg-gray-800 text-white text-sm rounded-lg px-4 py-2 max-w-xs shadow-xl">
        <div className="relative">
          {/* Arrow */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 
                        border-4 border-transparent border-b-gray-800" />
          <p className="leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}