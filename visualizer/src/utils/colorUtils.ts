export function getColorForLevel(level: number): string {
  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
  ];
  return colors[level % colors.length];
}