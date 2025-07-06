export function calculateNewLifeBar(
  power: number,
  currentLife: number,
  maxLife: number
): number {
  const baseDamage = (power / 100) * (maxLife * 0.25);
  const randomFactor = Math.random() * (maxLife * 0.05);
  const damage = Math.max(1, Math.round(baseDamage + randomFactor));
  const newLife = Math.max(0, currentLife - damage);

  console.log(Math.round(newLife));
  return Math.round(newLife);
}
