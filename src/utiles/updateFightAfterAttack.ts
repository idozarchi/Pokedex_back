import { FightState } from '../fight/fight.repo';

export function updateFightAfterAttack(
  fight: FightState,
  newLife: number,
  logEntry: any,
  isUserTurn: boolean
) {
  const defenderHPKey = isUserTurn ? 'opponentPokemonHP' : 'userPokemonHP';

  const updatedFight: Partial<FightState> = {
    [defenderHPKey]: newLife,
    battleLog: [...fight.battleLog, logEntry],
    turn: isUserTurn ? 'opponent' : 'user',
  };

  if (newLife <= 0) {
    updatedFight.status = 'finished';
    updatedFight.winnerId = (isUserTurn ? fight.userPokemon : fight.opponentPokemon).id;
  }

  return updatedFight;
}