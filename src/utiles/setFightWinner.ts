import { FightState } from '../types/fight-state.types';

export function setFightWinner(
  fight: FightState,
  isUserTurn: boolean,
): FightState {
  return {
    ...fight,
    status: 'finished',
    winnerId: (isUserTurn ? fight.userPokemon : fight.opponentPokemon).id,
  };
}
