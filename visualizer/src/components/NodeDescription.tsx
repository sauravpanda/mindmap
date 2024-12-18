import React from 'react';

interface NodeDescriptionProps {
  description: string;
}

export function NodeDescription({ description }: NodeDescriptionProps) {
  return (
    <div className="absolute z-10 left-0 top-full mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 w-64">
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}