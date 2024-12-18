interface Point {
  x: number;
  y: number;
}

export function calculateNodeCoordinates(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number
): Point {
  // Ensure all inputs are valid numbers
  const validCenterX = isFinite(centerX) ? centerX : 0;
  const validCenterY = isFinite(centerY) ? centerY : 0;
  const validRadius = isFinite(radius) ? radius : 0;
  const validAngle = isFinite(angle) ? angle : 0;

  return {
    x: validCenterX + Math.cos(validAngle) * validRadius,
    y: validCenterY + Math.sin(validAngle) * validRadius
  };
}

export function calculateControlPoints(
  start: Point,
  end: Point
): { control1: Point; control2: Point } {
  // Ensure valid coordinates
  const validStartX = isFinite(start.x) ? start.x : 0;
  const validStartY = isFinite(start.y) ? start.y : 0;
  const validEndX = isFinite(end.x) ? end.x : 0;
  const validEndY = isFinite(end.y) ? end.y : 0;

  const midX = (validStartX + validEndX) / 2;
  
  return {
    control1: { x: midX, y: validStartY },
    control2: { x: midX, y: validEndY }
  };
}