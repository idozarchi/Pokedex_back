import { Schema } from 'mongoose';

export type BattleLogEntry = {
  turn: string;
  move: string;
  damage: number;
  result: string;
  timestamp: Date;
};

export const FightSchema = new Schema({
  fightId: { type: String, required: true, unique: true },
  userPokemon: { type: Object, required: true },
  opponentPokemon: { type: Object, required: true },
  userPokemonHP: { type: Number, required: true },
  opponentPokemonHP: { type: Number, required: true },
  turn: { type: String, required: true },
  battleLog: {
    type: [
      {
        turn: String,
        move: String,
        damage: Number,
        result: String,
        timestamp: Date,
      },
    ],
    default: [],
  },
  winnerId: { type: Number, default: null },
  status: { type: String, default: 'in-progress' },
});
