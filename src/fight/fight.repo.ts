import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { BattleLogEntry } from './fight.schema';
import { Pokemon } from 'src/types/pokemon.types';

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
};

@Injectable()
export class FightRepo {
  constructor(
    @InjectModel('Fight') private readonly fightModel: Model<FightState>,
  ) {}

  async createFight(fight: FightState) {
    const created = new this.fightModel(fight);
    return created.save();
  }

  async getFight(fightId: string): Promise<FightState | null> {
    return this.fightModel.findOne({ fightId }).exec();
  }

  async updateFight(fightId: string, update: Partial<FightState>) {
    return this.fightModel
      .findOneAndUpdate({ fightId }, update, { new: true })
      .exec();
  }

  async deleteFight(fightId: string) {
    return this.fightModel.deleteOne({ fightId }).exec();
  }
}
