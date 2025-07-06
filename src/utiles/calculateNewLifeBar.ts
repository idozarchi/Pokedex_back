import { Pokemon } from '../schemas/pokemon.schema';

export function calculateNewLifeBar(
  attacker: Pokemon,
  defender: Pokemon,
  currentLife: number,
): number {
  const power = attacker.power ?? 50;
  const maxLife = defender.HP ?? 100;

  if (Math.random() < 0.15) {
    return currentLife;
  }

  const baseDamage = maxLife * 0.1 + power * 0.4;

  const randomFactor = 0.9 + Math.random() * 0.2;
  let damage = Math.round(baseDamage * randomFactor);

  damage = Math.max(1, Math.min(damage, Math.round(maxLife * 0.4)));

  const newLife = Math.max(0, currentLife - damage);
  return newLife;
}
