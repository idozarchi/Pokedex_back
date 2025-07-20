import { BattleLogEntry } from '../fight/fight.schema';
import { Pokemon } from '../schemas/pokemon.schema';

export type FightState = {
  fightId: string;
  userPokemon: Pokemon;
  opponentPokemon: Pokemon;
  userPokemonHP: number;
  opponentPokemonHP: number;
  turn: string;
  battleLog: BattleLogEntry[];
  winnerId: number | null;
  status: string;
  catchAttempts: number;
};
