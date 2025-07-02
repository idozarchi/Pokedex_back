import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FightState } from '../types/fight-state.types';

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
