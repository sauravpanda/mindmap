import React from 'react';

interface NodeTooltipProps {
  description: string;
}

export function NodeTooltip({ description }: NodeTooltipProps) {
  return (
    <div className="absolute z-50 left-1/2 top-full mt-2 -translate-x-1/2">
      <div className="bg-gray-900 text-white text-sm rounded-lg px-6 py-3 max-w-md shadow-xl">
        <div className="relative">
          {/* Arrow */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-gray-900" />
          <p className="leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}