import React from 'react';
import { getColorForLevel } from '../../utils/colorUtils';

interface ConnectionLineProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  level: number;
}

export function ConnectionLine({ startX, startY, endX, endY, level }: ConnectionLineProps) {
  // Calculate control points for the curved line
  const dx = endX - startX;
  const dy = endY - startY;
  
  // Control point distance - adjust this to change the curve
  const cpDistance = Math.min(Math.abs(dx), 100);
  
  // Calculate control points
  const cp1x = startX + (dx > 0 ? cpDistance : -cpDistance);
  const cp1y = startY;
  const cp2x = endX + (dx > 0 ? -cpDistance : cpDistance);
  const cp2y = endY;

  return (
    <path
      d={`M ${startX} ${startY} 
          C ${cp1x} ${cp1y},
            ${cp2x} ${cp2y},
            ${endX} ${endY}`}
      stroke={getColorForLevel(level)}
      strokeWidth="2"
      fill="none"
      className="transition-all duration-300 ease-in-out"
    />
  );
}