import React from 'react';

interface NodeTooltipProps {
  description: string;
}

export function NodeTooltip({ description }: NodeTooltipProps) {
  return (
    <div className="fixed z-[9999] left-1/2 top-4 -translate-x-1/2">
      <div className="bg-gray-900/95 backdrop-blur text-white text-base rounded-lg px-8 py-4 max-w-xl min-w-[400px] border border-gray-700">
        <div className="relative">
          <p className="leading-relaxed text-center">{description}</p>
        </div>
      </div>
    </div>
  );
}