import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Pokemon } from '../types/pokemon.types';

@Injectable()
export class AllPokemonsRepo {
  constructor(
    @InjectModel('AllPokemon')
    private readonly allPokemonModel: Model<Pokemon>,
  ) {}

  async findAll(
    limit?: number,
    offset?: number,
    sort?: string,
    order?: string,
    search?: string,
  ) {
    let filter: FilterQuery<Pokemon> = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    let query = this.allPokemonModel.find(filter);
    if (sort) {
      const sortOrder = order === 'desc' ? -1 : 1;
      query = query.sort({ [sort]: sortOrder });
    }
    if (typeof offset === 'number') query = query.skip(offset);
    if (typeof limit === 'number') query = query.limit(limit);
    return query.exec();
  }

  async findById(id: number) {
    return this.allPokemonModel.findOne({ id }).exec();
  }

  async count() {
    return this.allPokemonModel.countDocuments().exec();
  }
}
