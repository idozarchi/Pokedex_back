import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Pokemon } from '../schemas/pokemon.schema';

export type BattleLogEntry = {
  turn: Turn;
  damage: number;
  result: string;
  timestamp: Date;
};

export enum Turn {
  USER = 'user',
  OPPONENT = 'opponent',
}

@Schema({ collection: 'fights', timestamps: true })
export class Fight extends Document {
  @Prop({ required: true, unique: true, type: String })
  fightId: string;

  @Prop({ required: true, type: Pokemon })
  userPokemon: Pokemon;

  @Prop({ required: true, type: Pokemon })
  opponentPokemon: Pokemon;

  @Prop({ required: true, type: Number })
  userPokemonHP: number;

  @Prop({ required: true, type: Number })
  opponentPokemonHP: number;

  @Prop({ required: true, enum: Turn, type: String })
  turn: Turn;

  @Prop({
    type: [
      {
        turn: String,
        damage: Number,
        result: String,
        timestamp: Date,
      },
    ],
    default: [],
  })
  battleLog: BattleLogEntry[];

  @Prop({ type: Number, default: null })
  winnerId: number | null;

  @Prop({ default: 'in-progress', type: String })
  status: string;
}

export const FightSchema = SchemaFactory.createForClass(Fight);
