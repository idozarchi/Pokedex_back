import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Pokemon } from '../schemas/pokemon.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    @InjectModel('AllPokemon')
    private readonly allPokemonModel: Model<Pokemon>,
  ) {}

  async findById(userId: string) {
    return this.userModel.findOne({ userId }).exec();
  }

  async count() {
    return this.userModel.countDocuments().exec();
  }

  async create(user: Partial<User>) {
    const created = new this.userModel(user);
    return created.save();
  }

  async update(userId: string, user: Partial<User>) {
    return this.userModel.updateOne({ userId }, user).exec();
  }

  async getUserPokemons(user: User) {
    if (!user.ownedPokemons || user.ownedPokemons.length === 0) {
      console.log('No owned Pokemons found for user:', user.userId);
      return [];
    }
    return this.allPokemonModel
      .find({ id: { $in: user.ownedPokemons } })
      .exec();
  }
}
