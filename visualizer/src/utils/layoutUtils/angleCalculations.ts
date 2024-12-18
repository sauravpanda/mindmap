export function calculateChildAngles(
  currentAngle: number,
  angleStep: number,
  childCount: number
): { startAngle: number; endAngle: number }[] {
  const childAngleSpread = Math.min(Math.PI / 2, angleStep * 0.8);
  const angles: { startAngle: number; endAngle: number }[] = [];

  if (childCount <= 1) {
    return [{ startAngle: currentAngle, endAngle: currentAngle }];
  }

  for (let i = 0; i < childCount; i++) {
    const childStartAngle = currentAngle - childAngleSpread / 2 + 
      (childAngleSpread / (childCount - 1)) * i;
    const childEndAngle = childStartAngle + (childAngleSpread / childCount);
    angles.push({ startAngle: childStartAngle, endAngle: childEndAngle });
  }

  return angles;
}