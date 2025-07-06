import { Pokemon } from '../schemas/pokemon.schema';

export function calculateNewLifeBar(
  attacker: Pokemon,
  defender: Pokemon,
  currentLife: number,
): number {
  const power = attacker.power ?? 50;
  const maxLife = defender.HP ?? 100;

  const basePercent = 0.18 + (power / 100) * 0.17; // 18% to 35% of maxLife
  const baseDamage = maxLife * basePercent;
  const randomFactor = Math.random() * (maxLife * 0.05); // up to 5% of maxLife
  const damage = Math.max(1, Math.round(baseDamage + randomFactor));
  const newLife = Math.max(0, currentLife - damage);

  return Math.round(newLife);
}
