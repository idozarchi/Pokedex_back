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

  async getUserPokemons(
    user: User,
    options?: {
      sort?: string;
      order?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
      search?: string;
    },
  ) {
    if (!user.ownedPokemons || user.ownedPokemons.length === 0) {
      console.log('No owned Pokemons found for user:', user.userId);
      return [];
    }

    let query = this.allPokemonModel.find({ id: { $in: user.ownedPokemons } });

    if (options?.search) {
      const searchRegex = new RegExp(options.search, 'i');
      query = query.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
        ],
      });
    }

    if (options?.sort && options?.order) {
      const sortField = options.sort;
      const sortDirection = options.order === 'desc' ? -1 : 1;
      query = query.sort({ [sortField]: sortDirection });
    }

    if (options?.offset) {
      query = query.skip(options.offset);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    return query.exec();
  }
}
