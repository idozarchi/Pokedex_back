import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BattleLogEntry = {
  turn: string;
  damage: number;
  result: string;
  timestamp: Date;
};

@Schema({ collection: 'fights' })
export class Fight extends Document {
  @Prop({ required: true, unique: true })
  fightId: string;

  @Prop({ required: true, type: Object })
  userPokemon: any;

  @Prop({ required: true, type: Object })
  opponentPokemon: any;

  @Prop({ required: true })
  userPokemonHP: number;

  @Prop({ required: true })
  opponentPokemonHP: number;

  @Prop({ required: true })
  turn: string;

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

  @Prop({ default: 'in-progress' })
  status: string;
}

export const FightSchema = SchemaFactory.createForClass(Fight);
